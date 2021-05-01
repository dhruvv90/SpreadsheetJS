import * as fs from 'fs';
import * as jsZip from 'jszip';
import { Readable, PassThrough } from 'readable-stream';
import { Worksheet } from '../models';
import { KeyValueGeneric, wbTempType } from '../constants';
import { XmlApp, XmlCore, XmlSharedStrings, XmlWorkbook, XmlWorksheet } from './xml';


export namespace Excel {

    export class Workbook {

        private _temp: wbTempType = {
            sharedStrings: {
                ssItems: [],
                count: 0
            },
            sheetsInfo: {}
        };

        private _worksheets: Array<Worksheet> = [];
        
        private _isParsingComplete = false;

        private _meta: KeyValueGeneric = {};

        constructor() { }

        public getWorkSheet(s: number | string) {
            const res = this._worksheets.filter((sheet) => sheet.name === s || sheet.id == s);
            return res[0];
        }

        public async readFileAsync(path: string) {
            if (!fs.existsSync(path)) {
                throw new Error(`File doesn't exist at path : ${path}`);
            }
            const stream = fs.createReadStream(path);
            try {
                await this._read(stream);
                stream.close();
            }
            catch (error) {
                stream.close();
                console.log(error);
                throw error;
            }
        }

        private async _read(stream: Readable) {
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const zip = await jsZip.loadAsync(Buffer.concat(chunks));
            for (const entry of Object.values(zip.files)) {

                const content = await entry.async('string');
                const stream = new PassThrough({ readableObjectMode: true, writableObjectMode: true });

                // Default highWaterMark is 16 KB on most environments. 
                // Defining 10KB here to avoid backpressure in case of large XMLs.
                const chunkSize = 10 * 1024;
                for (let i = 0; i < content.length; i += chunkSize) {
                    stream.write(content.substring(i, i + chunkSize));
                }
                stream.end();

                switch (entry.name) {
                    case '/docProps/app.xml':
                    case 'docProps/app.xml': 
                        const xmlApp = new XmlApp();
                        await xmlApp.parseStream(stream);
                        Object.assign(this._meta, {
                            application: xmlApp.application
                        });
                        break;

                    case '/docProps/core.xml':
                    case 'docProps/core.xml':
                        const xmlCore = new XmlCore();
                        await xmlCore.parseStream(stream);
                        Object.assign(this._meta, xmlCore.metadata);
                        break;

                    case '/xl/sharedStrings.xml':
                    case 'xl/sharedStrings.xml':
                        const xmlSharedStrings = new XmlSharedStrings();
                        await xmlSharedStrings.parseStream(stream);
                        this._temp.sharedStrings.ssItems = xmlSharedStrings.ssItems;
                        this._temp.sharedStrings.count = xmlSharedStrings.count;
                        break;

                    case '/xl/workbook.xml':
                    case 'xl/workbook.xml':
                        const xmlWorkbook = new XmlWorkbook();
                        await xmlWorkbook.parseStream(stream);
                        this._temp.sheetsInfo = xmlWorkbook.sheetsInfo;
                        break;

                    default:
                        // Spreadsheet data
                        const match = entry.name.match(/xl\/worksheets\/sheet(\d+).xml/);
                        if (match) {
                            const xSheet = new XmlWorksheet(match[1]);
                            await xSheet.parseStream(stream);
                            this._worksheets.push(xSheet.worksheet);
                        }
                }
            }
            this._isParsingComplete = true;
            this._reconcile();
        }
        
        /** Post processing after parsing is complete */
        private _reconcile() {
            if (!this._isParsingComplete) {
                throw new Error('Invalid Call to _reconcile. This operation is only allowed after parsing');
            }
            this._worksheets.forEach((sheet) => sheet.reconcile(this._temp));
            delete this._temp;
        }
    }
}
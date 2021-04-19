import * as fs from 'fs';
import * as jsZip from 'jszip';
import { Readable, PassThrough } from 'readable-stream';
import { KeyValueGeneric } from './utils';
import { XmlApp } from './xml/xml-app';
import { XmlCore } from './xml/xml-core';


export namespace Excel {

    export class Workbook {

        private _data: KeyValueGeneric;

        constructor(options: any = {}) {
            this._data = {
                meta: {},
                worksheets: [],
            }
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
                let stream = new PassThrough({ readableObjectMode: true, writableObjectMode: true });

                // Default highWaterMark is 16 KB on most environments. 
                // Defining 10KB here to avoid backpressure in case of large XMLs.
                const chunkSize = 10 * 1024;
                for (let i = 0; i < content.length; i += chunkSize) {
                    stream.write(content.substring(i, i+chunkSize));
                }
                stream.end();

                switch (entry.name) {
                    case 'docProps/app.xml':
                        const xmlApp = new XmlApp();
                        await xmlApp.parseStream(stream);
                        Object.assign(this._data.meta, xmlApp.meta);
                        break;

                    case 'docProps/core.xml':
                        const xmlCore = new XmlCore();
                        await xmlCore.parseStream(stream);
                        Object.assign(this._data.meta, xmlCore.meta);
                        break;

                    default:
                        break;
                }
            }
        }
    }
}
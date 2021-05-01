import * as parser from '@fast-csv/parse';
import * as fs from 'fs';
import { CsvReaderOptions } from '../constants';


export namespace CSV {
    
    export class FileReader {

        private _rows: Array<Array<any>> = [];
        private _columns: Array<Array<any>> = [];

        public get rows(){
            return this._rows;
        }

        public get columns(){
            return this._columns;
        }

        public async readFileAsync(path: string, options: CsvReaderOptions = {}) {
            if (!fs.existsSync(path)) {
                throw new Error(`File doesn't exist at path : ${path}`);
            }
            const stream = fs.createReadStream(path);
            try {
                await this._read(stream, options);
                stream.close();
            }
            catch (error) {
                stream.close();
                console.log(error);
                throw error;
            }
        }

        private _read(stream: any, options: CsvReaderOptions = {}) {
            return new Promise((resolve, reject) => {
                parser.parseStream(stream, options.parserOptions)
                    .on('headers', (headers)=> this._processData(headers))
                    .on('data', (data) => this._processData(data))
                    .on('error', reject)
                    .on('end', _ => {
                        this._postProcess();
                        resolve(_);
                    });
            });
        }

        /** Data could be either array or Object ( with keys = headers ) */
        private _processData(data: any) {
            // Convert data to array
            const row: Array<string> = Object.values(data);
            this._rows.push(row);

        }

        private _postProcess() {
            // Add columns using rows
            const columns = [];
            this._rows.forEach((row, rIdx) => {
                row.forEach((data, cIdx) => {
                    if(!columns[cIdx]){
                        columns[cIdx] = [];
                    }
                    columns[cIdx][rIdx] = data;
                });
            });
            this._columns = columns;
        }
    }
}
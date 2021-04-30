import * as parser from '@fast-csv/parse';
import * as fs from 'fs';



export namespace CSV {

    export class FileReader {


        public async readFileAsync(path: string, options: parser.ParserOptionsArgs = {}) {
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

        private _read(stream: any, options: parser.ParserOptionsArgs = {}) {
            return new Promise((resolve, reject) => {
                parser.parseStream(stream, options)
                    .on('data', (data) => this._processData(data))
                    .on('error', reject)
                    .on('end', resolve);
            });
        }

        private _processData(data: any) {
            data;
        }
    }

}
import { Readable } from 'readable-stream';
import { KeyValue, parseSax } from '../utils';

export class XmlBase {
    public meta: any = {}

    public parseOpen(node) { }
    public parseClose(node) { }
    public parseText(text) { }

    private async _parse(saxEvents) {
        for await (const events of saxEvents) {
            for (const { type, value } of events) {
                switch (type) {
                    case 'opentag':
                        this.parseOpen(value);
                        break;
                    case 'closetag':
                        this.parseClose(value);
                        break;
                    case 'text':
                        this.parseText(value);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    public async parseStream(stream: Readable) {
        return this._parse(parseSax(stream));
    }
}



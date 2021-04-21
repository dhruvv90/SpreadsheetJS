import * as assert from 'assert';
import { Readable } from 'readable-stream';
import { KeyValue, KeyValueGeneric, parseSax } from '../utils';
import { XmlUnit } from './xml-unit';

export class XmlBase {

    protected _nodes: KeyValue<XmlUnit>;
    protected _parser: XmlBase;
    protected _data: KeyValueGeneric;
    protected _tag: string;


    constructor(tag?: string) {
        this._nodes = {};
        this._tag = tag;
    }

    protected populateData(): KeyValueGeneric {
        return {};
    }

    public parseOpen(node) {
        if (node.name in this._nodes) {
            this._parser = this._nodes[node.name];
            this._parser.parseOpen(node);
        }
    }

    public parseClose(node) {
        assert(this._tag, 'Tag is missing');

        if (this._parser) {
            this._parser.parseClose(node);
            this._parser = undefined;
        }

        if (node.name === this._tag) {
            this._data = this.populateData();
        }
    }

    public parseText(text: string) {
        if (this._parser) {
            this._parser.parseText(text);
        }
    }

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



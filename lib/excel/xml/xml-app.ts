import { KeyValue, KeyValueGeneric } from '../utils';
import { XmlBase } from './base';
import { XmlUnit } from './generic';


export class XmlApp extends XmlBase {
    private _nodes: KeyValue<XmlUnit>;
    private _parser: XmlBase;
    private _data: KeyValueGeneric;

    public get data(){
        return this._data;
    }

    constructor() {
        super();
        this._data = {};
        this._nodes = {
            'Application': new XmlUnit('Application'),
        }
    }

    public parseOpen(node) {
        if (node.name in this._nodes) {
            this._parser = this._nodes[node.name];
            this._parser.parseOpen(node);
        }
    }

    public parseClose(node) {
        if (this._parser) {
            this._parser.parseClose(node);
            this._parser = undefined;
        }

        switch (node.name) {
            case 'Properties':
                const data = {
                    application: this._nodes['Application'].value,
                };
                Object.assign(this._data, data);
                break;

            default:
                break;
        }
    }

    public parseText(text: string) {
        if (this._parser) {
            this._parser.parseText(text);
        }
    }
}
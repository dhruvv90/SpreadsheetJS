import { KeyValue } from '../utils';
import { XmlBase } from './base';
import { XmlGenericText } from './generic';


export class XmlApp extends XmlBase {
    private _nodes: KeyValue<XmlBase>;
    private _parser: XmlBase;


    constructor() {
        super();
        this._nodes = {
            'Application': new XmlGenericText('Application'),
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
                const meta = {
                    application: this._nodes['Application'].meta.value,
                }
                Object.assign(this.meta, meta);
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
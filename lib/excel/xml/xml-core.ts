import { KeyValue, KeyValueGeneric } from '../utils';
import { XmlBase } from './base';
import { XmlUnit, XmlValueType as Xtype } from './generic';


export class XmlCore extends XmlBase {
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
            'dcterms:created': new XmlUnit('dcterms:created', Xtype.DATETIME),
            'dc:creator': new XmlUnit('dc:creator'),
            'dc:description' : new XmlUnit('dc:description'),
            'dc:language': new XmlUnit('dc:language'),
            'cp:lastModifiedBy': new XmlUnit('cp:lastModifiedBy'),
            'dcterms:modified': new XmlUnit('dcterms:modified', Xtype.DATETIME),
            'cp:revision': new XmlUnit('cp:revision'),
            'dc:subject': new XmlUnit('dc:subject'),
            'dc:title': new XmlUnit('dc:title'),
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
            case 'cp:coreProperties':
                const meta = {
                    created :this._nodes['dcterms:created'].value,
                    createdBy: this._nodes['dc:creator'].value,
                    description: this._nodes['dc:description'].value,
                    language: this._nodes['dc:language'].value,
                    lastModifiedBy: this._nodes['cp:lastModifiedBy'].value,
                    modified: this._nodes['dcterms:modified'].value,
                    revision: this._nodes['cp:revision'].value,
                    subject: this._nodes['dc:subject'].value,
                    title: this._nodes['dc:title'].value,
                }
                Object.assign(this._data, meta);
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
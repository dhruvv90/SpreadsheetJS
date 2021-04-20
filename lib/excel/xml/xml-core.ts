import { KeyValue } from '../utils';
import { XmlBase } from './base';
import { XmlGenericDate, XmlGenericText } from './generic';


export class XmlCore extends XmlBase {
    private _nodes: KeyValue<XmlBase>;
    private _parser: XmlBase;


    constructor() {
        super();
        this._nodes = {
            'dcterms:created': new XmlGenericDate('dcterms:created'),
            'dc:creator': new XmlGenericText('dc:creator'),
            'dc:description' : new XmlGenericText('dc:description'),
            'dc:language': new XmlGenericText('dc:language'),
            'cp:lastModifiedBy': new XmlGenericText('cp:lastModifiedBy'),
            'dcterms:modified': new XmlGenericDate('dcterms:modified'),
            'cp:revision': new XmlGenericText('cp:revision'),
            'dc:subject': new XmlGenericText('dc:subject'),
            'dc:title': new XmlGenericText('dc:title'),
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
                    created :this._nodes['dcterms:created'].meta.value,
                    createdBy: this._nodes['dc:creator'].meta.value,
                    description: this._nodes['dc:description'].meta.value,
                    language: this._nodes['dc:language'].meta.value,
                    lastModifiedBy: this._nodes['cp:lastModifiedBy'].meta.value,
                    modified: this._nodes['dcterms:modified'].meta.value,
                    revision: this._nodes['cp:revision'].meta.value,
                    subject: this._nodes['dc:subject'].meta.value,
                    title: this._nodes['dc:title'].meta.value,
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
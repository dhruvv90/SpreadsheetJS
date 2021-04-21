import { XmlBase } from './base';
import { XmlUnit, XmlValueType as Xtype } from './xml-unit';


export class XmlCore extends XmlBase {

    constructor() {
        super();
        this._tag = 'cp:coreProperties';
        this._nodes = {
            'dcterms:created': new XmlUnit('dcterms:created', Xtype.DATETIME),
            'dc:creator': new XmlUnit('dc:creator'),
            'dc:description': new XmlUnit('dc:description'),
            'dc:language': new XmlUnit('dc:language'),
            'cp:lastModifiedBy': new XmlUnit('cp:lastModifiedBy'),
            'dcterms:modified': new XmlUnit('dcterms:modified', Xtype.DATETIME),
            'cp:revision': new XmlUnit('cp:revision'),
            'dc:subject': new XmlUnit('dc:subject'),
            'dc:title': new XmlUnit('dc:title'),
        }
    }

    public get data() {
        return this._data;
    }

    protected populateData() {
        this._data = {
            created: this._nodes['dcterms:created'].value,
            createdBy: this._nodes['dc:creator'].value,
            description: this._nodes['dc:description'].value,
            language: this._nodes['dc:language'].value,
            lastModifiedBy: this._nodes['cp:lastModifiedBy'].value,
            modified: this._nodes['dcterms:modified'].value,
            revision: this._nodes['cp:revision'].value,
            subject: this._nodes['dc:subject'].value,
            title: this._nodes['dc:title'].value,
        }
    }
}
import { KeyValueGeneric, XMLNodeType, XmlValueType as Xtype } from '../utils';
import { ParseableXmlUnit, BaseXmlUnit } from './base';

export class XmlCore extends ParseableXmlUnit {

    public metadata: KeyValueGeneric = {};

    constructor() {
        super('cp:coreProperties');
        this._nodes = {
            'dcterms:created': new BaseXmlUnit('dcterms:created', Xtype.DATETIME),
            'dc:creator': new BaseXmlUnit('dc:creator'),
            'dc:description': new BaseXmlUnit('dc:description'),
            'dc:language': new BaseXmlUnit('dc:language'),
            'cp:lastModifiedBy': new BaseXmlUnit('cp:lastModifiedBy'),
            'dcterms:modified': new BaseXmlUnit('dcterms:modified', Xtype.DATETIME),
            'cp:revision': new BaseXmlUnit('cp:revision'),
            'dc:subject': new BaseXmlUnit('dc:subject'),
            'dc:title': new BaseXmlUnit('dc:title'),
        }
    }

    protected onOpen(node: XMLNodeType) {


    }


    protected onClose() {
        Object.assign(this.metadata, {
            created: this._nodes['dcterms:created'].data.value,
            createdBy: this._nodes['dc:creator'].data.value,
            description: this._nodes['dc:description'].data.value,
            language: this._nodes['dc:language'].data.value,
            lastModifiedBy: this._nodes['cp:lastModifiedBy'].data.value,
            modified: this._nodes['dcterms:modified'].data.value,
            revision: this._nodes['cp:revision'].data.value,
            subject: this._nodes['dc:subject'].data.value,
            title: this._nodes['dc:title'].data.value,
        });
    }
}
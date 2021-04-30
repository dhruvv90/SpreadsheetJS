import { KeyValueGeneric } from '../../constants';
import { ParseableXmlUnit, XmlUnitDate, XmlUnitString } from './base';

export class XmlCore extends ParseableXmlUnit {

    public metadata: KeyValueGeneric = {};

    constructor() {
        super('cp:coreProperties');
        this._nodes = {
            'dcterms:created': new XmlUnitDate('dcterms:created'),
            'dc:creator': new XmlUnitString('dc:creator'),
            'dc:description': new XmlUnitString('dc:description'),
            'dc:language': new XmlUnitString('dc:language'),
            'cp:lastModifiedBy': new XmlUnitString('cp:lastModifiedBy'),
            'dcterms:modified': new XmlUnitDate('dcterms:modified'),
            'cp:revision': new XmlUnitString('cp:revision'),
            'dc:subject': new XmlUnitString('dc:subject'),
            'dc:title': new XmlUnitString('dc:title'),
        }
    }

    protected onOpen() {


    }


    protected onClose() {
        Object.assign(this.metadata, {
            created: this._nodes['dcterms:created'].value,
            createdBy: this._nodes['dc:creator'].value,
            description: this._nodes['dc:description'].value,
            language: this._nodes['dc:language'].value,
            lastModifiedBy: this._nodes['cp:lastModifiedBy'].value,
            modified: this._nodes['dcterms:modified'].value,
            revision: Number(this._nodes['cp:revision'].value),
            subject: this._nodes['dc:subject'].value,
            title: this._nodes['dc:title'].value,
        });
    }
}
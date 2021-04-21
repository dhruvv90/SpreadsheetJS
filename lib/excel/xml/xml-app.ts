import { KeyValueGeneric } from '../utils';
import { XmlBase } from './base';
import { XmlUnit } from './xml-unit';


export class XmlApp extends XmlBase {

    constructor() {
        super();
        this._tag = 'Properties';
        this._nodes = {
            'Application': new XmlUnit('Application'),
        }
    }

    public get data(): KeyValueGeneric {
        return this._data;
    }

    protected populateData() {
        this._data = {
            application: this._nodes['Application'].value,
        }
    }
}
import { KeyValueGeneric, XMLNodeType } from '../utils';
import { BaseXmlUnit, ParseableXmlUnit } from './base';


export class XmlApp extends ParseableXmlUnit {

    constructor() {
        super('Properties');
        this._nodes = {
            'Application': new BaseXmlUnit('Application'),
        }
    }

    protected processOpen(node: XMLNodeType): void {
        
    }

    protected processClose(): void {
        this._data.application =  this._nodes['Application'].data.value;
    }
}
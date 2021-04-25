import { KeyValueGeneric, XMLNodeType } from '../utils';
import { XmlUnitString, ParseableXmlUnit } from './base';


export class XmlApp extends ParseableXmlUnit {

    public application: string;

    constructor() {
        super('Properties');
        this._nodes = {
            'Application': new XmlUnitString('Application'),
        }
    }

    protected onOpen(node: XMLNodeType): void {
        
    }

    protected onClose(): void {
        this.application =  this._nodes['Application'].value;
    }
}
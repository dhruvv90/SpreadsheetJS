import { KeyValueGeneric, XMLNodeType } from '../utils';
import { BaseXmlUnit, ParseableXmlUnit } from './base';


export class XmlApp extends ParseableXmlUnit {

    public application: string;

    constructor() {
        super('Properties');
        this._nodes = {
            'Application': new BaseXmlUnit('Application'),
        }
    }

    protected onOpen(node: XMLNodeType): void {
        
    }

    protected onClose(): void {
        this.application =  this._nodes['Application'].data.value;
    }
}
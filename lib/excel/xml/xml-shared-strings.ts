import { XMLNodeType } from "../utils";
import { BaseXmlUnit, ParseableXmlUnit } from "./base";


class XmlSharedStringItem extends ParseableXmlUnit {

    constructor(){
        super('si');
        this._nodes = {
            't': new BaseXmlUnit('t')
        }
        this._data.items = [];
    }

    protected processOpen(node: XMLNodeType): void {

    }
    
    protected processClose(): void {
        this._data.items.push(this._nodes['t'].data.value);
    }

}

export class XmlSharedStrings extends ParseableXmlUnit {

    private _sharedStrings: Array<string>;

    public get sharedStrings(){
        return this._sharedStrings;
    }

    constructor() {
        super('sst');
        this._nodes = {
            si: new XmlSharedStringItem(),
        }
        this._sharedStrings = [];
    }

    protected processOpen(node: XMLNodeType): void {
        Object.assign(this._data, {
            uniqueCount: node.attributes.uniqueCount,
            count: node.attributes.count
        });
    }

    protected processClose(): void {
        this._data.ssList = this._nodes['si'].data.items;
    }

}
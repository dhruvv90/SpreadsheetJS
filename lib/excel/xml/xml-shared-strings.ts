import { XMLNodeType, XmlValueType } from "../utils";
import { BaseXmlUnit, ParseableXmlUnit } from "./base";


class XmlSharedStringItems extends ParseableXmlUnit {

    public ssItems: Array<string> = [];

    constructor() {
        super('si');
        this._nodes = {
            't': new BaseXmlUnit('t')
        }
    }

    protected onOpen(node: XMLNodeType): void {

    }

    protected onClose(): void {
        this.ssItems.push(this._nodes['t'].data.value)
    }

}

export class XmlSharedStrings extends ParseableXmlUnit {

    public ssItems: Array<string> = [];
    public uniqueCount: number;
    public count: number;

    constructor() {
        super('sst');
        this._nodes = {
            'si': new XmlSharedStringItems(),
        }
    }

    protected onOpen(node: XMLNodeType): void {
        Object.assign(this._data, {
            uniqueCount: node.attributes.uniqueCount,
            count: node.attributes.count
        });
    }

    protected onClose() {
        this.ssItems = (this._nodes['si'] as XmlSharedStringItems).ssItems;
        this.uniqueCount = this._data.attributes.uniqueCount;
        this.count = this._data.attributes.count;
    }

}
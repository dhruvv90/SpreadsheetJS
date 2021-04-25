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
        const tNode = this._nodes['t'];
        this.ssItems.push(tNode.value);
        
        tNode.resetValue();
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

    }

    protected onClose() {
        this.ssItems = (this._nodes['si'] as XmlSharedStringItems).ssItems;
        this.uniqueCount = this.attributes.uniqueCount;
        this.count = this.attributes.count;
    }

}
import { XMLNodeType } from "../utils";
import { XmlUnitString, ParseableXmlUnit } from "./base";


class XmlSharedStringItems extends ParseableXmlUnit {

    public ssItems: Array<string> = [];

    constructor() {
        super('si');
        this._nodes = {
            't': new XmlUnitString('t')
        }
    }

    protected onOpen(node: XMLNodeType): void {

    }

    protected onClose(): void {
        const tNode = this._nodes['t'];
        this.ssItems.push(tNode.value);
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
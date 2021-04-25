import { XMLNodeType } from "../utils";
import { XmlUnitString, ParseableXmlUnit } from "./base";


class XmlSharedStringItems extends ParseableXmlUnit {

    public ssItems: Array<string> = [];

    constructor() {
        super('si');
        this._nodes = {
            't': new XmlUnitString('t', {concat: true})
        }
    }

    protected onOpen(): void {

    }

    protected onClose(): void {
        const tNode = this._nodes['t'] as XmlUnitString;
        this.ssItems.push(tNode.value);

        tNode.resetValue();
    }

}

export class XmlSharedStrings extends ParseableXmlUnit {

    public ssItems: Array<string> = [];
    public count: number;

    constructor() {
        super('sst');
        this._nodes = {
            'si': new XmlSharedStringItems(),
        }
    }

    protected onOpen(): void {

    }

    protected onClose() {
        this.ssItems = (this._nodes['si'] as XmlSharedStringItems).ssItems;
        this.count = Number(this.attributes.count);
    }

}
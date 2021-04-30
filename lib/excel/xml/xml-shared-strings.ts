import { XmlUnitString, ParseableXmlUnit } from "./base";


class XmlSharedStringItems extends ParseableXmlUnit {

    public ssItems: Array<string> = [];

    constructor() {
        super('si');
    }

    protected onOpen(): void {
        this._nodes['t'] = new XmlUnitString('t', { concat: true });
    }

    protected onClose(): void {
        const tNode = this._nodes['t'] as XmlUnitString;
        this.ssItems.push(tNode.value);
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
        const siNode = this._nodes['si'] as XmlSharedStringItems;
        this.ssItems = siNode.ssItems;
        this.count = Number(this.attributes.count);
    }
}
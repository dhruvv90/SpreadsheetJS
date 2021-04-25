import { SheetInfo, XMLNodeType } from "../utils";
import { ParseableXmlUnit } from "./base";


class XmlSheetInfo extends ParseableXmlUnit {

    public sheetsInfo: Array<SheetInfo> = [];


    constructor() {
        super('sheet');
    }

    protected onOpen(node: XMLNodeType): void {
        this.sheetsInfo.push({
            name : this.attributes.name,
            sheetId: this.attributes.sheetId,
            state : this.attributes.state,
            rId: this.attributes['r:id']
        });
    }

    protected onClose(): void {

    }
}

class XmlSheetsInfo extends ParseableXmlUnit {

    public sheetsInfo: Array<SheetInfo> = [];

    constructor() {
        super('sheets');
        this._nodes = {
            'sheet': new XmlSheetInfo()
        }
    }

    protected onOpen(node: XMLNodeType): void {

    }

    protected onClose(): void {
        this.sheetsInfo = (this._nodes['sheet'] as XmlSheetInfo).sheetsInfo;
    }

}

export class XmlWorkbook extends ParseableXmlUnit {

    public sheetsInfo: Array<SheetInfo> = [];

    constructor() {
        super('workbook');
        this._nodes = {
            'sheets': new XmlSheetsInfo()
        }
    }

    protected onOpen(node: XMLNodeType): void {

    }

    protected onClose(): void {
        this.sheetsInfo = (this._nodes['sheets'] as XmlSheetsInfo).sheetsInfo;
    }
}

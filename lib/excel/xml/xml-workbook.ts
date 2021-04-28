import { KeyValue, SheetInfo, XMLNodeType } from "../utils";
import { ParseableXmlUnit } from "./base";


class XmlSheetInfo extends ParseableXmlUnit {

    public sheetsInfo: KeyValue<SheetInfo> = {};


    constructor() {
        super('sheet');
    }

    protected onOpen(): void {
        const sheetId = this.attributes.sheetId;
        this.sheetsInfo[sheetId] = {
            sheetId,
            name: this.attributes.name,
            state: this.attributes.state,
            rId: this.attributes['r:id']
        };
    }

    protected onClose(): void {

    }
}

class XmlSheetsInfo extends ParseableXmlUnit {

    public sheetsInfo: KeyValue<SheetInfo> = {};

    constructor() {
        super('sheets');
        this._nodes = {
            'sheet': new XmlSheetInfo()
        }
    }

    protected onOpen(): void {

    }

    protected onClose(): void {
        this.sheetsInfo = (this._nodes['sheet'] as XmlSheetInfo).sheetsInfo;
    }

}

export class XmlWorkbook extends ParseableXmlUnit {

    public sheetsInfo: KeyValue<SheetInfo> = {};

    constructor() {
        super('workbook');
        this._nodes = {
            'sheets': new XmlSheetsInfo()
        }
    }

    protected onOpen(): void {

    }

    protected onClose(): void {
        this.sheetsInfo = (this._nodes['sheets'] as XmlSheetsInfo).sheetsInfo;
    }
}

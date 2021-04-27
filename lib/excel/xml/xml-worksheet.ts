import { Cell, Row, Worksheet } from "../model";
import { CellDataType, CellDataTypeInv } from "../utils";
import { XmlUnitString, ParseableXmlUnit, XmlUnitDate, XmlUnitNumber } from "./base";


class XmlCell extends ParseableXmlUnit {

    public cells: Array<Cell> = [];
    private _currentCell: Cell;


    constructor() {
        super('c');
        this._nodes['f'] = new XmlUnitString('f');
    }

    public resetValue() {
        this.cells = [];
    }

    protected onOpen() {
        const r = this.attributes.r;
        const t = this.attributes.t;

        this._currentCell = new Cell(r);

        // t will be undefined for blank cell
        if (t) {
            const fullType = CellDataTypeInv[t];
            if (!fullType) {
                throw new Error(`Invalid Cell value type : ${t} for ${r}`);
            }

            const valTypeMap = {
                [CellDataType.DATE]: XmlUnitDate,
                [CellDataType.ERROR]: XmlUnitString,
                [CellDataType.INLINE_STRING]: XmlUnitNumber,
                [CellDataType.NUMBER]: XmlUnitNumber,
                [CellDataType.SHARED_STRING]: XmlUnitNumber,
                [CellDataType.STRING]: XmlUnitString,
            }
            const valType = valTypeMap[t];
            if (!valType) {
                throw new Error(`For Cell : ${r}, dataType : '${t}' ( ${fullType} ) is not supported yet.`)
            }
            this._nodes['v'] = new valType('v');
            this._currentCell.type = fullType;
        }
    }

    protected onClose(): void {
        this._currentCell.formula = this._nodes['f'].value;
        this._currentCell.value = this._nodes['v'].value;

        this.cells.push(this._currentCell);
        this._currentCell = undefined;
    }
}


class XmlRow extends ParseableXmlUnit {

    public rows: Array<Row> = [];

    private _currentRow: Row;
    private _cellNode: XmlCell;

    constructor() {
        super('row');
        this._cellNode = new XmlCell();
        this._nodes = {
            'c': this._cellNode
        }
    }

    protected onOpen(): void {
        this._currentRow = new Row(Number(this.attributes.r));
    }

    protected onClose(): void {
        this._currentRow.cells = this._cellNode.cells;
        this.rows.push(this._currentRow);

        this._currentRow = undefined;
        this._cellNode.resetValue();
    }
}


class XmlSheetData extends ParseableXmlUnit {

    public rows: Array<Row> = [];

    constructor() {
        super('sheetData');
        this._nodes = {
            'row': new XmlRow()
        }
    }

    protected onOpen(): void {

    }

    protected onClose(): void {
        this.rows = (this._nodes['row'] as XmlRow).rows;
    }

}

export class XmlWorksheet extends ParseableXmlUnit {

    public worksheet: Worksheet;


    constructor(id: string) {
        super('worksheet');
        this._nodes = {
            'sheetData': new XmlSheetData()
        }
        this.worksheet = new Worksheet(id);
    }

    protected onOpen(): void {

    }

    protected onClose(): void {
        this.worksheet.rows = (this._nodes['sheetData'] as XmlSheetData).rows;
    }

}

import { Cell, Row, Worksheet } from "../models";
import { CellDataType, CellDataTypeInv } from "../constants";
import { XmlUnitString, ParseableXmlUnit, XmlUnitDate, XmlUnitNumber } from "./base";


class XmlCell extends ParseableXmlUnit {

    public cells: Array<Cell> = [];
    private _currentCell: Cell;
    private _typeToClassMapping = {
        [CellDataType.DATE]: XmlUnitDate,
        [CellDataType.ERROR]: XmlUnitString,
        [CellDataType.INLINE_STRING]: XmlUnitNumber,
        [CellDataType.NUMBER]: XmlUnitNumber,
        [CellDataType.SHARED_STRING]: XmlUnitNumber,
        [CellDataType.STRING]: XmlUnitString,
    };


    constructor() {
        super('c');
        this._nodes['f'] = new XmlUnitString('f');
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
            this._currentCell.type = t;

            const valueClass = this._typeToClassMapping[t];
            if (!valueClass) {
                throw new Error(`For Cell : ${r}, dataType : '${t}' ( ${fullType} ) is not supported yet.`)
            }
            this._nodes['v'] = new valueClass('v');
        }

        this._nodes['f'] = new XmlUnitString('f');
    }

    protected onClose(): void {
        const fNode = this._nodes['f'];
        this._currentCell.formula = fNode.value;

        const vNode = this._nodes['v'];
        if(vNode){
            this._currentCell.parsedValue = vNode.value;
            this.cells.push(this._currentCell);
        }
    }
}


class XmlRow extends ParseableXmlUnit {

    public rows: Array<Row> = [];
    private _currentRow: Row;

    constructor() {
        super('row');
    }

    protected onOpen(): void {
        this._currentRow = new Row(Number(this.attributes.r));
        this._nodes = {
            'c': new XmlCell()
        }
    }

    protected onClose(): void {
        const cNode = this._nodes['c'] as XmlCell;
        if(cNode.cells.length){
            this._currentRow.addCells(cNode.cells);
            this.rows.push(this._currentRow);
        }
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
        const sNode = this._nodes['sheetData'] as XmlSheetData;
        this.worksheet.addRows(sNode.rows);
    }

}

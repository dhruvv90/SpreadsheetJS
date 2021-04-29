import { Excel } from "../excel";
import { SheetState } from "../constants";
import { refToRC, isNumber, colToIdx, isString } from "../utils";
import { Row } from "./row";
import { Column } from "./column";


export class Worksheet {

    private _state: SheetState;

    private _rows: Array<Row> = [];

    private _columns: Array<Column> = [];

    private _name: string;

    /** 1-based index */
    private _idx: number;


    constructor(id: string) {
        if (!isNumber(Number(id))) {
            throw new Error(`Invalid id : ${id} for sheet`);
        }
        this._idx = Number(id);
    }


    public get name() {
        return this._name;
    }


    public addRows(r: Array<Row>) {
        r.forEach((row) => this._rows[row.idx - 1] = row);
    }


    /**
     * @param idx 1-based index
     */
    public getRow(idx: number) {
        return this._rows[idx - 1];
    }


    public getCellByRef(r: string) {
        const { row, col } = refToRC(r);
        return this.getCellByRC(row, colToIdx(col));
    }


    /**
     * @param row 1-based index
     * @param col 1-based index
     */
    public getCellByRC(row: number, col: number) {
        const r = this.getRow(row);
        if (r) {
            return r.getCell(col);
        }
    }


    public rowCount() {
        return this._rows.length;
    }


    public getLastRow() {
        return this._rows[this.rowCount() - 1];
    }


    /**
     * @param fn (row, idx), where idx is 1-based index 
     */
    public eachRow(fn: (row: Row, idx: number) => void) {
        this._rows.forEach((row, idx) => {
            fn(row, idx + 1);
        });
    }


    public addColumns(c: Array<Column>) {
        c.forEach((column) => this._columns[column.idx - 1] = column);
    }


    /**
     * @param idx 1-based index OR string (e.g C, A)
     */
    public getColumn(i: number | string) {
        let idx;
        if (isNumber(i)) {
            idx = i;
        }
        else if (isString(i)) {
            idx = colToIdx(i as string);
        }
        return this._columns[idx - 1];
    }

    public reconcile(data: Excel.wbInternalType) {
        if (this._idx in data.sheetsInfo) {
            this._name = data.sheetsInfo[this._idx].name;
            this._state = data.sheetsInfo[this._idx].state;
        }
    }
};
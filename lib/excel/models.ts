import { CellDataType, colToIdx, isNumber, isString, KeyValueGeneric, refToRC, SheetState } from "./utils";

export class Worksheet {
    private _state: SheetState;
    private _rows: Array<Row> = [];

    /** 1-based index */
    private _idx: number;

    constructor(id: string, s: SheetState = SheetState.VISIBLE) {
        if (!isNumber(Number(id))) {
            throw new Error(`Invalid id : ${id} for sheet`);
        }
        this._idx = Number(id);
        this._state = s;
    }

    public addRows(r: Array<Row>) {
        r.forEach((row) => this._rows[row.idx - 1] = row);
    }

    /**
     * 
     * @param idx 1-based index
     */
    public getRow(idx: number) {
        return this._rows[idx - 1];
    }

    public getCellByRef(r: string) {
        const { row, col } = refToRC(r);
        return this.getCellByRC(row, col);
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
     * 
     * @param fn (row, idx), where idx is 1-based index 
     */
    public eachRow(fn: (row: Row, idx: number) => void) {
        this._rows.forEach((row, idx) => {
            fn(row, idx + 1);
        });
    }

    public reconcile(data: KeyValueGeneric) {

    }
};


export class Cell {

    private _value: any;
    private _dataType: CellDataType;
    private _formula: string;
    private _ref: string;

    private _row: number;
    private _col: number;


    constructor(ref: string) {
        const { row, col } = refToRC(ref);

        this._ref = ref;
        this._row = row;
        this._col = col;
    }

    public get rowNumber() {
        return this._row;
    }

    public get colNumber() {
        return this._col;
    }

    public get ref() {
        return this._ref;
    }

    public set value(v: any) {
        this._value = v;
    }

    public set type(t: CellDataType) {
        this._dataType = t;
    }

    public set formula(f: string) {
        this._formula = f;
    }
}

export class Row {
    private _cells: Array<Cell> = [];

    /** 1-based index */
    public idx: number;

    constructor(idx: number) {
        this.idx = idx;
    }

    public addCells(c: Array<Cell>) {
        c.forEach((cell) => {
            if (cell.rowNumber !== this.idx) {
                throw new Error(`Invalid Cell : ${cell.ref} added to row : ${this.idx}`);
            }
            this._cells[cell.colNumber - 1] = cell;
        })
    }

    /**
     * 
     * @param i 1-based index OR column letter (eg. A)
     */
    public getCell(i: number | string) {
        let idx;
        if (isNumber(i)) {
            idx = i;
        }
        else if (isString(i)) {
            idx = colToIdx(i as string);
        }
        return this._cells[idx - 1];
    }

    /**
     * 
     * @param fn (cell, idx), where idx is 1-based index 
     */
    public eachCell(fn: (cell: Cell, idx: number) => void) {
        this._cells.forEach((cell) => {
            fn(cell, cell.colNumber);
        });
    }
}
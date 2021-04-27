import { CellDataType, colToIdx, isNumber, isString, SheetState } from "./utils";

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

    public set rows(r: Array<Row>) {
        this._rows = r;
    }

    /**
     * 
     * @param idx 1-based index
     */
    public getRow(idx: number) {
        return this._rows[idx - 1];
    }

    /**
     * 
     * @param i Standard Column notation
     */
    public getCell(i: string) {

    }


    /**
     * 
     * @param fn (cell, idx), where idx is 1-based index 
     */
    public eachCell(fn: (row: Row, idx: Number) => void) {
        this._rows.forEach((row, idx) => {
            fn(row, idx + 1);
        });
    }
};


export class Cell {

    private _value: any;
    private _formula: string;
    private _dataType: CellDataType;
    private _reference: string;

    constructor(reference: string) {
        this._reference = reference;
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
    public idx: Number;

    constructor(idx: Number) {
        this.idx = idx;
    }

    public set cells(c: Array<Cell>) {
        this._cells = c;
    }

    /**
     * 
     * @param i 1-based index 
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
    public eachCell(fn: (cell: Cell, idx: Number) => void) {
        this._cells.forEach((cell, idx) => {
            fn(cell, idx + 1);
        });
    }
}
import { colToIdx, isNumber, isString } from "../utils";
import { Cell } from "./cell";


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
     * @param fn (cell, idx), where idx is 1-based index 
     */
    public eachCell(fn: (cell: Cell, idx: number) => void) {
        this._cells.forEach((cell) => {
            fn(cell, cell.colNumber);
        });
    }
}
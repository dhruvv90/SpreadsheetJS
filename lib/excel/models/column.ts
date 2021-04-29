import { colToIdx, isNumber, isString } from "../utils";
import { Cell } from "./cell";


export class Column {
    private _cells: Array<Cell> = [];

    /** 1-based index */
    public idx: number;

    public strIdx: string;


    constructor(strIdx: string) {
        this.idx = colToIdx(strIdx);
        this.strIdx = strIdx;
    }


    public addCells(c: Array<Cell>) {
        c.forEach((cell) => {
            if (cell.colString !== this.strIdx) {
                throw new Error(`Invalid Cell : ${cell.ref} added to col : ${this.strIdx}`);
            }
            this._cells[cell.rowNumber - 1] = cell;
        })
    }


    /**
     * @param i 1-based index
     */
    public getCell(i: number) {
        return this._cells[i - 1];
    }


    /**
     * @param fn (cell, idx), where idx is 1-based index 
     */
    public eachCell(fn: (cell: Cell, idx: number) => void) {
        this._cells.forEach((cell) => {
            fn(cell, cell.rowNumber);
        });
    }
}
import { CellDataType } from "../constants";
import { colToIdx, refToRC } from "../utils";


export class Cell {

    private _value: any;

    private _dataType: CellDataType;

    private _formula: string;

    private _ref: string;

    private _row: number;

    private _col: string;


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
        return colToIdx(this._col);
    }

    public get colString() {
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
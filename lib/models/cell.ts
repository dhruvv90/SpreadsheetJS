import { CellDataType } from "../constants";
import { colToIdx, refToRC, stringToBool } from "../utils";


export class Cell {

    public parsedValue: any;
    
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

    public get value() {
        if (!this._value) {
            // Value will be available aftesr reconcilliation
            throw new Error(`Value not computed for Cell : ${this._ref}`);
        }
        return this._value;
    }

    public updateValue(ss: Array<string>) {
        if (this._value) {
            return;
        }
        let val = this.parsedValue;

        switch (this._dataType) {
            case CellDataType.BOOLEAN:
                val = stringToBool(val);
                break;

            case CellDataType.DATE:
                val = new Date(val);
                break;

            case CellDataType.NUMBER:
                val = Number(val);
                break;

            case CellDataType.SHARED_STRING:
                val = ss[Number(this.parsedValue)];
                break;

            default:
                break;
        }
        this._value = val;
        
        if (!this._value) {
            throw new Error(`Unable to update Cell Value for Cell : ${this._ref}`);
        }
    }

    public set type(t: CellDataType) {
        this._dataType = t;
    }

    public set formula(f: string) {
        this._formula = f;
    }
}
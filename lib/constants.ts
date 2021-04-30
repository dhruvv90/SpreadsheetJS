import { inverseMap } from "./utils";


//-----------------
//  Types
//-----------------

export type KeyValue<T> = Record<string, T>;

export type KeyValueGeneric = KeyValue<any>;

export type XmlDataType = {
    value?: any;
    attributes: KeyValueGeneric;
}

export type XMLNodeType = {
    name: string;
    attributes?: KeyValueGeneric
}

export type SheetInfo = {
    sheetId: number;
    rId: string;
    name: string;
    state: SheetState;
}

export type wbTempType = {
    sharedStrings: {
        ssItems: Array<string>;
        count: number
    },

    sheetsInfo: KeyValue<SheetInfo>;
}


//-----------------
//  Enums
//-----------------

export enum SheetState {
    HIDDEN = 'hidden',
    VISIBLE = 'visible'
}

export enum CellDataType {
    BOOLEAN = 'b',
    DATE = 'd',
    ERROR = 'e',
    INLINE_STRING = 'inlineStr',
    NUMBER = 'n',
    SHARED_STRING = 's',
    STRING = 'str'
}


//-----------------
//  Constants
//-----------------

export const CellDataTypeInv: KeyValue<CellDataType> = inverseMap(CellDataType);
export const SheetStateInv: KeyValue<SheetState> = inverseMap(SheetState);


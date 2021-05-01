import { KeyValueGeneric } from "./constants";
import * as saxes from 'saxes';
import { Readable } from 'readable-stream';


/**
 * can process these forms - case insensitive :  'true', 't'. All others/undef is false
 */
export const stringToBool = function (s: string): boolean {
    if (!s) return false;
    const truthyList = ['true', 't'];
    const comparator = s.toLowerCase();
    if (truthyList.includes(comparator)) return true;
    return false;
}

export const isValidDate = function (d: Date) {
    return !!d && !isNaN(d.getTime())
}

export const isNumber = function (x: any) {
    return (typeof x == 'number') || (x instanceof Number);
}

export const isString = function (x: any) {
    return (typeof x == 'string') || (x instanceof String);
}


//-----------------
//  XML Utils
//-----------------

export const parseSax = async function* (stream: Readable) {
    const parser = new saxes.SaxesParser();

    let events = [];
    let error;

    parser.on("text", (value) => events.push({ type: 'text', value }));
    parser.on("opentag", (value) => events.push({ type: 'opentag', value }));
    parser.on("closetag", (value) => events.push({ type: 'closetag', value }));
    parser.on("error", (e) => error = e);

    for await (const chunk of stream) {
        parser.write(chunk.toString());

        if (error)
            throw error;

        yield events;
        events = [];
    }
}


//-----------------
//  Model Utils - Cell / Row / Column / Sheet
//-----------------


/** Validates col string and converts to 1-based index (e.g A -> 1) */
export const colToIdx = function (col: string) {
    validateColString(col);

    let result = 0;
    for (let i = col.length - 1; i >= 0; i--) {
        const unicode = col.toUpperCase().charCodeAt(i);
        if (unicode < 65 || unicode > 90) {
            throw new Error(`Invalid Column string : ${col}`);
        }
        const multFactor = (i + 1 === col.length) ? 1 : 26;
        result += (unicode - 64) * multFactor;
    }
    return result;
}


/** Validates Cell Reference (e.g A3) and converts it to to 1-based index of row , column */
export const refToRC = function (r: string) {
    const match = validateRef(r, true);
    return {
        row: Number(match[2]),
        col: match[1]
    }
}

const validateRef = function (r: string, throwOnFail = false) {
    const match = r.match(/^([A-Z]+)(\d+)$/);
    if (throwOnFail && !match) {
        throw new Error(`Invalid Reference : ${r}`);
    }
    return match;
}

const validateColString = function (c: string, throwOnFail = false) {
    const match = c.match(/^([A-Z]+)$/);
    if (throwOnFail && !match) {
        throw new Error(`Invalid Col string : ${c}`);
    }
    return match;
}


export const inverseMap = function (kv: KeyValueGeneric): KeyValueGeneric {
    if (!kv) return {};

    const result: KeyValueGeneric = {};
    Object.keys(kv).forEach((k) => {
        result[kv[k]] = k;
    });
    return result;
}
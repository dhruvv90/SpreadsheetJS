import * as saxes from 'saxes';
import { Readable } from 'readable-stream';


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

export enum SheetState {
    HIDDEN = 'hidden',
    VISIBLE = 'visible'
}

export type SheetInfo = {
    sheetId: number;
    rId: string;
    name: string;
    state: SheetState;
}



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



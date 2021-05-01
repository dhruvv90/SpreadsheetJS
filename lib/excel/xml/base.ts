import * as assert from 'assert';
import { Readable } from 'readable-stream';
import { KeyValue, KeyValueGeneric, XmlDataType, XMLNodeType } from '../../constants';
import {isValidDate, parseSax} from '../../utils';

/** Every XML Unit which needs to be parsed must extend this */
export abstract class ParseableXmlUnit {

    /** Stores child nodes to traverse and extract data from */
    protected _nodes: KeyValue<ParseableXmlUnit>;

    /** Represents current Parser while traversing XML  */
    protected _parser: ParseableXmlUnit;

    /** Stores data extracted from self + child nodes */
    private _data: XmlDataType;


    /** Represents string tag of current XML node. 
     *  this is used while parsing - data is extracted and
     *  stored (from child nodes) during closing of tag.
     */
    protected _tag: string;


    public get value() {
        return this._data.value;
    }

    public set value(value: any) {
        this._data.value = value
    }

    public get attributes() {
        return this._data.attributes;
    }

    public get tag() {
        return this._tag;
    }

    constructor(tag: string) {
        assert(tag, `Illegal ParseableXmlUnit construction. 'tag' must be present`);
        this._tag = tag;
        this._nodes = {};
        this._data = {
            attributes: {}
        }
    }

    /**
     * Invoked during opentag event of current node. 
     */
    protected abstract onOpen(): void;


    /** Invoked during closetag event of current node. Usage:
     * * Can be used to extract required data from child nodes through _nodes
     * * Can be used for any post processing after parsing is complete 
     */
    protected abstract onClose(): void;


    public parseOpen(node: XMLNodeType) {
        if (node.name === this._tag) {
            this._data.attributes = node.attributes;
            this.onOpen();
        }
        if (this._parser) {
            this._parser.parseOpen(node);
        }
        else if (node.name in this._nodes) {
            this._parser = this._nodes[node.name];
            this._parser.parseOpen(node);
        }
    }

    public parseClose(node) {
        if (this._parser) {
            this._parser.parseClose(node);
        }
        if (node.name in this._nodes) {
            this._parser = undefined;
        }
        if (node.name === this._tag) {
            this.onClose();
        }
    }

    public parseText(text: string) {
        if (this._parser) {
            this._parser.parseText(text);
        }
    }

    private async _parse(saxEvents) {
        for await (const events of saxEvents) {
            for (const { type, value } of events) {
                switch (type) {
                    case 'opentag':
                        this.parseOpen(value);
                        break;
                    case 'closetag':
                        this.parseClose(value);
                        break;
                    case 'text':
                        this.parseText(value);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    public async parseStream(stream: Readable) {
        return this._parse(parseSax(stream));
    }
}


/**
 * Represents a Base XML unit (of a specific type) which can have parseable data and no further nesting. 
 * Every node will converge eventually to a base node. 
 */
export class XmlUnitString extends ParseableXmlUnit {

    private _concat: boolean;

    constructor(tag: string, options: KeyValueGeneric = {}) {
        super(tag);
        this._concat = options.concat;
    }

    public parseText(value: string) {
        if (this._concat) {
            this.value = (this.value || '').concat(value);
        }
        else {
            if(typeof value !== 'string'){
                throw new Error(`Invalid String : ${value}`);
            }
            this.value = value;
        }
    }

    protected onOpen(): void {

    }

    protected onClose(): void {

    }
}


export class XmlUnitDate extends ParseableXmlUnit {

    constructor(tag: string) {
        super(tag);
    }

    public parseText(value: string) {
        const d = new Date(value);
        if(!isValidDate(d)){
            throw new Error(`Invalid date string : ${value}`);
        }
        this.value = d;
    }

    protected onOpen(): void {

    }

    protected onClose(): void {

    }
}


export class XmlUnitNumber extends ParseableXmlUnit {

    constructor(tag: string) {
        super(tag);
    }

    public parseText(value: string) {
        const n = Number(value);
        if(isNaN(n)){
            throw new Error(`Invalid Number string : ${value}`);
        }
        this.value = n;
    }

    protected onOpen(): void {

    }

    protected onClose(): void {

    }
}


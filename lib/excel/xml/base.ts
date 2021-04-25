import * as assert from 'assert';
import { Readable } from 'readable-stream';
import { KeyValue, parseSax, XmlDataType, XMLNodeType, XmlValueType } from '../utils';

/** Every XML Unit which needs to be parsed must extend this */
export abstract class ParseableXmlUnit {

    /** Stores child nodes to traverse and extract data from */
    protected _nodes: KeyValue<ParseableXmlUnit>;


    /** Represents current Parser while traversing XML  */
    protected _parser: ParseableXmlUnit;


    /** Stores data extracted from self + child nodes */
    protected _data: XmlDataType;


    /** Represents string tag of current XML node. 
     *  this is used while parsing - data is extracted and
     *  stored (from child nodes) during closing of tag.
     */
    protected _tag: string;


    public get data() {
        return this._data;
    }

    public get tag() {
        return this._tag;
    }


    constructor(tag: string) {
        assert(tag, `Illegal ParseableXmlUnit construction. 'tag' must be present`);
        this._tag = tag;

        this._nodes = {};
        this._data = {};
    }

    /**
     * Invoked during opentag event of current node. Usage:
     * * should be used to store attributes, if required
     * * Can be for any pre-processing before parsing starts
     */
    protected abstract processOpen(node: XMLNodeType): void;


    /** Invoked during closetag event of current node. Usage:
     * * Should be used to extract required data from child nodes through _nodes
     * * Can be used for any post processing after parsing is complete 
     */
    protected abstract processClose(): void;



    public parseOpen(node: XMLNodeType) {
        if (node.name === this._tag) {
            this.processOpen(node);
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
        
        if (node.name in this._nodes){
            this._parser = undefined;
        }
        
        if (node.name === this._tag) {
            this.processClose();
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
export class BaseXmlUnit extends ParseableXmlUnit {

    private _type: XmlValueType;
    private _valueParser: Record<XmlValueType, Function>


    constructor(tag: string, type: XmlValueType = XmlValueType.TEXT) {
        super(tag);

        if (!(type in XmlValueType)) {
            throw new Error(`Illegal BaseXmlUnit Construction. 'type' : ${type} must be in ${Object.keys(XmlValueType).join(', ')}`);
        }
        this._type = type;

        this._valueParser = {
            [XmlValueType.TEXT]: (value: string) => value,
            [XmlValueType.DATETIME]: (value: string) => new Date(value),
        }
    }

    public parseText(value: string) {
        this._data.value = this._valueParser[this._type](value);
    }

    protected processOpen(node: XMLNodeType): void {
        Object.assign(this._data, node.attributes);
    }

    protected processClose(): void {

    }
}




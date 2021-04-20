import { KeyValue, KeyValueGeneric } from '../utils';
import { XmlBase } from './base';

export enum XmlValueType {
    TEXT = 'TEXT',
    DATETIME = 'DATETIME',
}

export class XmlUnit extends XmlBase {

    private _tag: string;
    private _type: XmlValueType;
    private _attributes: KeyValueGeneric;
    private _parsingMap: KeyValue<Function>

    protected _value: string;

    public get value() {
        return this._value;
    }

    public get attributes() {
        return this._attributes;
    }

    constructor(tag: string, type: XmlValueType =  XmlValueType.TEXT) {
        super();
        this._type = type;
        this._tag = tag;
        this._attributes = {};

        if (!(type in XmlValueType)) {
            throw new Error(`Illegal Construction- type : ${type} must be in ${Object.keys(XmlValueType).join(', ')}`);
        }

        this._parsingMap = {
            [XmlValueType.TEXT]: (value: string) => value,
            [XmlValueType.DATETIME]: (value: string) => new Date(value),
        }
    }

    public parseOpen(node) {
        switch (node.name) {
            case this._tag:
                Object.assign(this._attributes, node.attributes);
                break;
            default:
                throw new Error(`Unable to parse open tag for node : ${node.name}. XmlUnit expected!`);
        }
    }

    public parseClose(node) {
        switch (node.name) {
            case this._tag:
                // do nothing
                break;
            default:
                throw new Error(`Unable to parse close tag for node : ${node.name}. XmlUnit expected!`);
        }

    }

    public parseText(value: string) {
        this._value = this._parsingMap[this._type](value);
    }
}

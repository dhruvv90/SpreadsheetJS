import { KeyValue } from '../utils';
import { XmlBase } from './base';
import * as assert from 'assert';

export enum XmlValueType {
    TEXT = 'TEXT',
    DATETIME = 'DATETIME',
}

/**
 * Basic/simple XML unit, of which every XML file is composed of.
 * * Has either no value or a text value
 * * can have attributes
 * * Does not have any nested inner XML tags
 */
export class XmlUnit extends XmlBase {

    private _type: XmlValueType;
    private _parsingMap: KeyValue<Function>

    public get value() {
        return this._data.value;
    }

    public get attributes() {
        return this._data.attributes;
    }

    constructor(tag: string, type: XmlValueType = XmlValueType.TEXT) {
        super(tag);

        assert(!!tag, 'tag must be present');
        this._tag = tag;


        this._type = type;
        this._data = {
            attributes: {},
            value: undefined
        }

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
                this._data.attributes = node.attributes;
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
        this._data.value = this._parsingMap[this._type](value);
    }

    protected populateData(): void {
        throw new Error('Illegal method call. Not allowed');
    }
}

import { KeyValueGeneric } from '../utils';
import { XmlBase } from './base';


export class XmlGeneric extends XmlBase {
    public meta: {
        attributes: KeyValueGeneric;
        tag?: string;
        value?: any;
    }

    constructor() {
        super();
        this.meta.attributes = {};
    }
}

export class XmlGenericText extends XmlGeneric {

    constructor(tag: string) {
        super();
        this.meta.tag = tag;
    }

    public parseOpen(node) {
        if (this.meta.tag === node.name) {
            this.meta.attributes = node.attributes;
        }
    }

    public parseClose(node) {

    }

    public parseText(value) {
        this.meta.value = value;
    }
}

export class XmlGenericDate extends XmlGeneric {

    constructor(tag: string) {
        super();
        this.meta.tag = tag;
    }

    public parseOpen(node) {
        if (this.meta.tag === node.name) {
            this.meta.attributes = node.attributes;
        }
    }

    public parseClose(node) {

    }

    public parseText(value: string) {
        this.meta.value = new Date(value);
    }

}
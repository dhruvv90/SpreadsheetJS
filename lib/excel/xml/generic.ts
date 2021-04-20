import { XmlBase } from './base';

export class XmlGenericText extends XmlBase {

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

export class XmlGenericDate extends XmlBase {

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
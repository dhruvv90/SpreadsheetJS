import { XMLNodeType } from "../utils";
import { BaseXmlUnit, ParseableXmlUnit } from "./base";


export class XmlSharedStrings extends ParseableXmlUnit {

    private _sharedStrings: Array<string>;

    constructor() {
        super('sst');
        this._nodes = {
            't': new BaseXmlUnit('t'),
        }
        this._sharedStrings = [];
    }

    protected processOpen(node: XMLNodeType): void {
        Object.assign(this._data, {
            uniqueCount: node.attributes.uniqueCount,
            count: node.attributes.count
        });
    }

    public parseOpen(node: XMLNodeType) {
        if (node.name === this._tag) {
            this.processOpen(node);
        }

        if(node.name === 'si'){
            this.data.temp = [];
        }

        if (node.name in this._nodes) {
            this._parser = this._nodes[node.name];
            this._parser.parseOpen(node);
        }
    }

    public parseText(text: string) {
        if (this._parser) {
            this._parser.parseText(text);
        }
    }

    public parseClose(node) {
        if (this._parser) {
            if(this._parser.tag === 't'){
                this._data.temp.push(this._parser.data.value)
            }
            this._parser.parseClose(node);
            this._parser = undefined;
        }

        if (node.name === 'si') {
            const text = this._data.temp.join('');
            this._sharedStrings.push(text);
        }

        if (node.name === this._tag) {
            this.processClose();
        }
    }

    protected processClose(): void {
        this._data.ssList = this._sharedStrings;
    }

}
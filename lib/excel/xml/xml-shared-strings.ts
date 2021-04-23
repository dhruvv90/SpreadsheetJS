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

    public parseClose(node) {
        if (this._parser) {
            this._parser.parseClose(node);
            this._parser = undefined;
        }

        if (node.name === 'si') {
            const text = this._nodes['t'].data.value;
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
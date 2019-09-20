import { DIDType } from "../../types/did";

export class DidParserResult {
    public tokenName: string;
    public type: DIDType;
    public explicitValue: string;
    public query: string;

    constructor(tokenName, type, explicitValue, query) {
        this.tokenName = tokenName;
        this.type = type;
        this.explicitValue = explicitValue;
        this.query = query;
    }
}

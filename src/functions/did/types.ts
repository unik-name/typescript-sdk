import { DIDType } from "../../types";

export class DidParserError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export type DidParserResult = {
    tokenName: string;
    type: DIDType;
    explicitValue: string;
    query: string;
};

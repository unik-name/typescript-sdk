import { DIDType } from "../../types";

/* tslint:disable:no-empty */
export class DidParserError extends Error {}

export type DidParserResult = {
    tokenName: string;
    type: DIDType;
    explicitValue: string;
    query: string;
};

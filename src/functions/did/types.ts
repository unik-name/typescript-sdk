import { DIDType } from "../..";

/* tslint:disable:no-empty */
export class DidParserError extends Error {}

export type DidParserResult = {
    tokenName: string;
    type: DIDType;
    explicitValue: string;
    query: string;
};

export { DIDHelpers, DIDTypes, DIDType } from "@uns/crypto";

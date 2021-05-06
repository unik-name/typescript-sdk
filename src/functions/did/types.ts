import { DIDHelpers as CryptoDIDHelpers, DIDTypes, DIDType } from "@uns/crypto";

/* tslint:disable:no-empty */
export class DidParserError extends Error {}

export type DidParserResult = {
    tokenName: string;
    type: DIDType;
    explicitValue: string;
    query: string;
};

const isDIDType = (id: number | string): boolean => {
    if (typeof id === "number") {
        return CryptoDIDHelpers.codes().includes(id);
    } else {
        return CryptoDIDHelpers.labels().includes(id.toUpperCase());
    }
};

const parseType = (id: number | string): DIDTypes | undefined => {
    if (!isDIDType(id)) {
        return undefined;
    } else {
        return typeof id === "string" ? (DIDTypes[id.toUpperCase() as DIDType] as DIDTypes) : (id as DIDTypes);
    }
};

const DIDHelpers = {
    ...CryptoDIDHelpers,
    isDIDType,
    parseType,
};

export { DIDHelpers, DIDTypes, DIDType };

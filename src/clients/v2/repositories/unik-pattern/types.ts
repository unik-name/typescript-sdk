import { DIDTypes, DIDScript, UNSLengthGroup } from "../../../../did";

export type UnikPatterRequestBody = {
    explicitValue: string;
    type: DIDTypes;
};

export type UnikPattern = {
    lengthGroup: UNSLengthGroup;
    script: DIDScript;
    didType: DIDTypes;
};

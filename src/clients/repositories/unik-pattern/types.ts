import { DIDScript, UNSLengthGroup } from "../../../functions/did/constants";
import { DIDTypes } from "../../../functions/did/types";

export type UnikPatterRequestBody = {
    explicitValue: string;
    type: DIDTypes;
};

export type UnikPattern = {
    lengthGroup: UNSLengthGroup;
    script: DIDScript;
    didType: DIDTypes;
};

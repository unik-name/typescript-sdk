import { DIDTypes, DIDScript, UNSLengthGroup } from "../../../../did";
import { NftFactoryServicesList, UNSServiceType } from "./constants";

import { UnikPattern } from "../unik-pattern";

export type NetworkUnitService = {
    id: NftFactoryServicesList;
    description: string;
    cost: number;
    type: UNSServiceType;
};

export type NetworkUnitMintService = NetworkUnitService & {
    script: DIDScript;
    didType: DIDTypes;
    lengthRange?: { id: UNSLengthGroup; min: number; max?: number };
};

export type SearchNetworkUnitServiceRequest = UnikPattern & {
    transaction: UNSServiceType;
};

export type SearchNetworkUnitMintServiceRequest = {
    dtype?: DIDTypes;
};

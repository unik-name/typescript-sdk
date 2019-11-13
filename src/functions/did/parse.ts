import { UNSClient } from "../../clients/client";
import { DIDHelpers, DIDTypes, DIDType } from "../../types/did";
import { DidParserResult, DidParserError } from "./types";

const DID_PATTERN = /@?(unik:)?((?:individual|organization|network|1|2|3):)?([^\?\/\:@]+)(\?(?:[a-zA-Z0-9]+|\*{1}))?/;
const DID_TYPES: string[] = Object.keys(DIDTypes).map(type => type.toLowerCase());

export const allowedTypesByToken: {} = {
    unik: DID_TYPES,
};

export const parse = async (did: string, client: UNSClient): Promise<DidParserResult | DidParserError> => {
    if (!did) {
        return new DidParserError("Empty DID");
    }

    // A DID has to start with DID_PREFIX
    const matching: RegExpMatchArray | null = did.match(DID_PATTERN);

    // Need full matching (matching[0] should be equal to did)
    if (!matching || matching[0] !== did) {
        return new DidParserError("DID does not match expected format");
    }

    // Get informations from regex groups
    const tokenName = matching[1] ? matching[1].replace(":", "") : "unik";
    let type: number = DIDTypes.INDIVIDUAL;
    if (matching[2]) {
        const rawType = matching[2].replace(":", "");
        type = !Number.isNaN(+rawType) ? +rawType : DIDHelpers.fromLabel(rawType.toUpperCase() as DIDType);
    }
    const explicitValue = matching[3];
    const query = matching[4];

    if (!(await checkExplicitValue(explicitValue, client))) {
        return new DidParserError("Invalid explicit value format");
    }

    return {
        tokenName,
        explicitValue,
        query,
        type: DIDHelpers.fromCode(type) as DIDType,
    };
};

const checkExplicitValue = async (explicitValue: string, client: UNSClient): Promise<boolean> => {
    if (explicitValue.length > 100) {
        return false;
    }

    const result = await client.safetypo.analyze(explicitValue);
    return !!result.data;
};

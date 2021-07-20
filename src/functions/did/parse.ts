import { DidParserResult, DidParserError, DIDTypes, DIDHelpers, DIDType } from "./types";
import { UNSClient } from "../../clients";
import { UNS_NFT_PROPERTY_KEY_REGEX } from "../unik/constants";

const TOKEN_PATTERN = /@?(unik:)?/;
const TYPE_PATTERN = /((?:individual|organization|network|1|2|3):)?/;
const ID_PATTERN = /([^\?\/\:@]+)/;

let KEY_PROP_REGEX: string = UNS_NFT_PROPERTY_KEY_REGEX.source;

// Remove start and end anchors if exist, the property key regex has to be inserted in another regex
if (KEY_PROP_REGEX.startsWith("^")) {
    KEY_PROP_REGEX = KEY_PROP_REGEX.substr(1);
}

if (KEY_PROP_REGEX.endsWith("$")) {
    KEY_PROP_REGEX = KEY_PROP_REGEX.substr(0, KEY_PROP_REGEX.length - 1);
}

const QUERY_PATTERN = `(\\?(?:${KEY_PROP_REGEX}|\\*{1}))?`;

const DID_PATTERN = new RegExp(TOKEN_PATTERN.source + TYPE_PATTERN.source + ID_PATTERN.source + QUERY_PATTERN);

const DID_TYPES: string[] = Object.keys(DIDTypes).map(type => type.toLowerCase());

export const allowedTypesByToken: Record<string, unknown> = {
    unik: DID_TYPES,
};

export const parse = async (did: string, client: UNSClient): Promise<DidParserResult | DidParserError> => {
    const parseDIDResult: DidParserResult | DidParserError = await parseDID(did);

    if (parseDIDResult instanceof DidParserError) {
        return parseDIDResult;
    }

    if (!isValidDID(parseDIDResult.explicitValue) || !(await isSafetypoString(parseDIDResult.explicitValue, client))) {
        return new DidParserError("Invalid explicit value format");
    }

    return parseDIDResult;
};

export const isValidDID = (explicitValue: string): boolean => explicitValue?.length < 100;

const isSafetypoString = async (explicitValue: string, client: UNSClient): Promise<boolean> => {
    const result = await client.safetypo.analyze(explicitValue);
    return !!result.data;
};

// Parse a unik DID without length or safetypo check
export const parseDID = async (did: string): Promise<DidParserResult | DidParserError> => {
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

    return {
        tokenName,
        explicitValue,
        query,
        type: DIDHelpers.fromCode(type) as DIDType,
    };
};

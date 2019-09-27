import { BackendClient } from "../../clients/uns/api-client";
import { DIDHelpers, DIDTypes } from "../../types/did";
import { DidParserResult } from "./did-parser-result";
import { DidParserError } from "./errors/did-parser-error";

const DID_PATTERN = /@(unik:)?((?:individual|organization|network|1|2|3)\/)?([^\?\/\:]+)(\?(?:[a-zA-Z0-9]+|\*{1}))?/;
const DID_TYPES: string[] = Object.keys(DIDTypes).map(type => type.toLowerCase());

const apiClient: BackendClient = new BackendClient();

export const allowedTypesByToken: {} = {
    unik: DID_TYPES,
};

export const parse = async (did: string): Promise<DidParserResult | DidParserError> => {
    if (!did) {
        return new DidParserError("Empty DID");
    }

    // A DID has to start with DID_PREFIX
    const matching: RegExpMatchArray = did.match(DID_PATTERN);

    // Need full matching (matching[0] should be equal to did)
    if (!matching || matching[0] !== did) {
        return new DidParserError("DID does not match expected format");
    }

    // Get informations from regex groups
    const tokenName = matching[1] ? matching[1].replace(":", "") : "unik";
    let type = matching[2] ? matching[2].replace("/", "") : "individual";
    const explicitValue = matching[3];
    const query = matching[4];

    if (!Number.isNaN(+type)) {
        type = DIDHelpers.fromCode(parseInt(matching[2], 10)).toLowerCase();
    }

    if (!(await checkExplicitValue(explicitValue))) {
        return new DidParserError("Invalid explicit value format");
    }

    return new DidParserResult(tokenName, type, explicitValue, query);
};

const checkExplicitValue = async (explicitValue: string): Promise<boolean> => {
    if (explicitValue.length > 100) {
        return false;
    }

    try {
        await apiClient.safetypo.analyze({ body: { explicitValue } });
    } catch (e) {
        console.debug(e);
        return false;
    }

    return true;
};

import { UNSClient, ChainMeta, FingerprintResult, Response, FunctionalError, Unik, PropertyValue } from "../..";
import { parse } from "./parse";
import { DidParserError, DidParserResult } from "./types";
import { Network } from "../../config";
import { getPropertyValueWithChainmeta, getUnikWithChainMetaAndConfirmations } from "../../utils";

let client: UNSClient;

export interface DidResolution<T> {
    data?: T;
    chainmeta?: ChainMeta;
    confirmations?: number;
    error?: FunctionalError | DidParserError;
}

export const didResolve = async (did: string, network: Network): Promise<DidResolution<PropertyValue | Unik>> => {
    client = new UNSClient();
    client.init({ network });

    const parseResult: DidParserResult | DidParserError = await parse(did, client);

    if (parseResult instanceof Error) {
        return {
            error: parseResult,
        };
    }

    const fingerprintResult: Response<FingerprintResult> = await client.fingerprint.compute(
        parseResult.explicitValue,
        parseResult.type,
    );

    if (fingerprintResult.error) {
        return { error: fingerprintResult.error };
    }

    const tokenId = fingerprintResult?.data?.fingerprint;

    if (!tokenId) {
        return { error: new Error("Unable to compute DID id") };
    }

    if (parseResult.query) {
        if (parseResult.query === "?*") {
            const unik = await getUnikWithChainMetaAndConfirmations(tokenId, client);
            return {
                data: unik?.data?.ownerId,
                chainmeta: unik.chainmeta,
                confirmations: unik.confirmations,
            };
        } else {
            // Return property
            const query = parseResult.query.substr(1);
            return getPropertyValueWithChainmeta(tokenId, query, client);
        }
    }
    return getUnikWithChainMetaAndConfirmations(tokenId, client);
};

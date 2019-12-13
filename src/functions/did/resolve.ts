import { UNSClient, ChainMeta, FingerprintResult, Response, FunctionalError, Unik } from "../..";
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

export type ResolutionResult = {
    unikid: string;
    ownerAddress: string;
    [_: string]: string;
};

/**
 * Returns owner address (string), UNIK informations or Property value with UNIK informations (ResolutionResult)
 * @param did
 * @param network
 */
export const didResolve = async (did: string, network: Network): Promise<DidResolution<string | ResolutionResult>> => {
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
        parseResult.tokenName,
    );

    if (fingerprintResult.error) {
        return { error: fingerprintResult.error };
    }

    const tokenId = fingerprintResult?.data?.fingerprint;

    if (!tokenId) {
        return { error: new Error("Unable to compute DID id") };
    }

    const unik = await getUnikWithChainMetaAndConfirmations(tokenId, client);

    if (!unik.data) {
        return { error: new Error(`Unable to find UNIK ${tokenId}`) };
    }

    let datas;

    if (parseResult.query) {
        if (parseResult.query === "?*") {
            // Returns DID owner address
            datas = unik?.data?.ownerId;
        } else {
            // Returns UNIK infomations with property value
            const query = parseResult.query.substr(1);
            const propertyValue = await getPropertyValueWithChainmeta(tokenId, query, client);

            datas = {
                ...computeUnikDatas(unik.data),
                [query]: propertyValue?.data,
            };
        }
    } else {
        // Returns UNIK informations
        datas = computeUnikDatas(unik.data);
    }
    return {
        data: datas,
        chainmeta: unik.chainmeta,
        confirmations: unik.confirmations,
    };
};

function computeUnikDatas(unik: Unik) {
    return {
        unikid: unik.id,
        ownerAddress: unik.ownerId,
    };
}

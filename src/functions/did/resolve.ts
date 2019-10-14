import { UNSClient, ChainMeta, FingerprintResult, Response, FunctionalError, Unik, PropertyValue } from "../..";
import { parse } from "./parse";
import { DidParserError, DidParserResult } from "./types";
import { Network } from "../../config";

let client: UNSClient;

export interface DidResolution<T> {
    data?: T;
    chainmeta?: ChainMeta;
    confirmations?: number;
    error?: FunctionalError | DidParserError;
}

export const didResolve = async (
    did: string,
    network: Network = Network.devnet,
): Promise<DidResolution<PropertyValue | Unik>> => {
    client = new UNSClient(network);

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

    const tokenId = fingerprintResult.data.fingerprint;

    if (parseResult.query) {
        if (parseResult.query === "?*") {
            const unik = await getUnikWithChainMetaAndConfirmations(tokenId);
            return {
                data: unik.data.ownerId,
                chainmeta: unik.chainmeta,
                confirmations: unik.confirmations,
            };
        } else {
            // Return property
            const query = parseResult.query.substr(1);
            return getPropertyValue(tokenId, query);
        }
    }
    return getUnikWithChainMetaAndConfirmations(tokenId);
};

const getUnikWithChainMetaAndConfirmations = async (tokenId: string): Promise<DidResolution<Unik>> => {
    const unik = await client.unik.get(tokenId);
    const transaction = await client.transaction.get(unik.data.transactions.last.id);

    if (unik.chainmeta.height !== transaction.chainmeta.height) {
        throw new Error(
            `Consistency error, please retry (unik height: ${unik.chainmeta.height}, transaction height: ${transaction.chainmeta.height})`,
        );
    }
    return {
        data: unik.data,
        chainmeta: unik.chainmeta,
        confirmations: transaction.data.confirmations,
    };
};

const getPropertyValue = async (tokenId: string, propertyKey): Promise<DidResolution<string>> => {
    const unik = await getUnikWithChainMetaAndConfirmations(tokenId);

    const propertyValue = await client.unik.property(tokenId, propertyKey);
    if (unik.chainmeta.height !== propertyValue.chainmeta.height) {
        throw new Error("Unable to read right now. Please retry.");
    }
    return {
        data: propertyValue.data,
        chainmeta: propertyValue.chainmeta,
        confirmations: unik.confirmations,
    };
};

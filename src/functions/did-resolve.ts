import { UNSClient } from "..";
import { UniknameClient } from "../clients/uns/api-client";
import { NetworkConfig } from "../clients/uns/config";
import { ResourceWithChainMeta } from "../clients/uns/resources";
import { FingerPrint } from "../clients/uns/resources/fingerprint";
import { UnikToken, PropertyValue } from "../clients/uns/resources/uniks";
import { parse } from "../utils/did-parser/did-parser";
import { DidParserResult } from "../utils/did-parser/did-parser-result";
import { DidParserError } from "../utils/did-parser/errors/did-parser-error";

let client: UNSClient;

export const didResolve = async (
    did: string,
    network: string = "DEVNET",
): Promise<DidParserError | ResourceWithChainMeta<string | number | UnikToken>> => {
    const selectedNetwork = NetworkConfig[network.toUpperCase()];

    client = new UNSClient(selectedNetwork);

    const parseResult: DidParserResult | DidParserError = await parse(did);

    if (parseResult instanceof Error) {
        return parseResult;
    }

    const apiClient = new UniknameClient();
    const fingerprintResult: FingerPrint = await apiClient.fingerprint.computeFingerprint({
        body: {
            explicitValue: parseResult.explicitValue,
            type: parseResult.type,
        },
    });

    const tokenId = fingerprintResult.fingerprint;

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

const getUnikWithChainMetaAndConfirmations = async (tokenId: string) => {
    const unik = await client.uniks.get(tokenId);
    const transaction = await client.transactions.get(unik.data.transactions.last.id);

    if (unik.chainmeta.height !== transaction.chainmeta.height) {
        throw new Error(
            `Consistency error, please retry (unik height: ${unik.chainmeta.height}, transaction height: ${transaction.chainmeta.height})`,
        );
    }
    unik.confirmations = transaction.data.confirmations;
    return unik;
};

const getPropertyValue = async (tokenId: string, propertyKey): Promise<ResourceWithChainMeta<PropertyValue>> => {
    const unik = await getUnikWithChainMetaAndConfirmations(tokenId);
    const propertyValue = await client.uniks.propertyValue(tokenId, propertyKey);
    if (unik.chainmeta.height !== propertyValue.chainmeta.height) {
        throw new Error(
            `Consistency error, please retry (unik height: ${unik.chainmeta.height}, property height: ${propertyValue.chainmeta.height})`,
        );
    }
    propertyValue.confirmations = unik.confirmations;
    return propertyValue;
};

import { UNSClient } from "..";
import { UniknameClient } from "../clients/uns/api-client";
import { NetworkConfig } from "../clients/uns/config";
import { ResourceWithChainMeta } from "../clients/uns/resources";
import { FingerPrint } from "../clients/uns/resources/fingerprint";
import { UnikToken } from "../clients/uns/resources/uniks";
import { parse } from "../utils/did-parser/did-parser";
import { DidParserResult } from "../utils/did-parser/did-parser-result";
import { DidParserError } from "../utils/did-parser/errors/did-parser-error";

export const didResolve = async (
    did: string,
    network: string = "DEVNET",
): Promise<DidParserError | ResourceWithChainMeta<string | number | UnikToken>> => {
    const selectedNetwork = NetworkConfig[network.toUpperCase()];

    const client = new UNSClient(selectedNetwork);

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
            const unik = await client.uniks.get(tokenId, client);
            return {
                data: unik.data.ownerId,
                chainmeta: unik.chainmeta,
                confirmations: unik.confirmations,
            };
        } else {
            // Return property
            const query = parseResult.query.substr(1);
            return await client.uniks.propertyValue(tokenId, query, client);
        }
    }
    return await client.uniks.get(tokenId, client);
};

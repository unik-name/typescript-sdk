import { UNSClient, ResourceWithChainMeta } from "../clients";

export const getUnikWithChainMetaAndConfirmations = async (tokenId: string, client: UNSClient) => {
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

export const getPropertyValue = async (
    tokenId: string,
    propertyKey,
    client: UNSClient,
    withConfirmations: boolean = true,
): Promise<ResourceWithChainMeta<string>> => {
    const propertyValue = await client.uniks.propertyValue(tokenId, propertyKey);
    if (withConfirmations) {
        const unik = await getUnikWithChainMetaAndConfirmations(tokenId, client);
        if (propertyValue.chainmeta.height !== unik.chainmeta.height) {
            throw new Error("Unable to read right now. Please retry.");
        }
        propertyValue.confirmations = unik.confirmations;
    }
    return propertyValue;
};

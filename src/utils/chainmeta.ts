import { UNSClient, ResponseWithChainMeta, PropertyValue } from "..";

export const getUnikWithChainMetaAndConfirmations = async (tokenId: string, client: UNSClient) => {
    const unik = await client.unik.get(tokenId);
    const lastTransaction = unik?.data?.transactions?.last;
    if (!lastTransaction) {
        throw new Error(`Unable to find last transaction applied on UNIK with id ${tokenId}`);
    }
    const transaction = await client.transaction.get(lastTransaction?.id);

    if (unik.chainmeta.height !== transaction.chainmeta.height) {
        throw new Error(
            `Consistency error, please retry (unik height: ${unik.chainmeta.height}, transaction height: ${transaction.chainmeta.height})`,
        );
    }
    unik.confirmations = transaction?.data?.confirmations;
    return unik;
};

export const getPropertyValueWithChainmeta = async (
    tokenId: string,
    propertyKey: string,
    client: UNSClient,
    withConfirmations: boolean = true,
): Promise<ResponseWithChainMeta<PropertyValue>> => {
    const propertyValue = await client.unik.property(tokenId, propertyKey);
    if (withConfirmations) {
        const unik = await getUnikWithChainMetaAndConfirmations(tokenId, client);
        if (propertyValue?.chainmeta?.height !== unik?.chainmeta?.height) {
            throw new Error("Unable to read right now. Please retry.");
        }
        propertyValue.confirmations = unik.confirmations;
    }
    return propertyValue;
};

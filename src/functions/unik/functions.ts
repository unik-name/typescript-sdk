import {
    INftStatus,
    PioneerBadgeGrades,
    PIONEER_EARLY_ADOPTER_LIMIT,
    PropertyValue,
    ResponseWithChainMeta,
    UNSClient,
} from "../..";
import { merge } from "../../utils/merge";
import { getUTCTime } from "./utils";

export type PropertyOptions = {
    withChainmeta?: boolean;
    confirmations?: boolean;
    disableHtmlEscape?: boolean;
};

const defaultPropertyOptions = {
    withChainmeta: false,
    confirmations: false,
    disableHtmlEscape: false,
};

export const getPropertyValue = async (
    unikid: string,
    propertyKey: string,
    client: UNSClient,
    opts: PropertyOptions = defaultPropertyOptions,
): Promise<ResponseWithChainMeta<PropertyValue> | PropertyValue> => {
    const options: PropertyOptions = merge<PropertyOptions>(defaultPropertyOptions, opts);

    const propertyValue: ResponseWithChainMeta<PropertyValue> = await getPropertyValueWithChainmeta(
        unikid,
        propertyKey,
        client,
        options.confirmations,
    );

    if (propertyValue.data && options.disableHtmlEscape) {
        propertyValue.data = escape(propertyValue.data);
    }

    if (!options.withChainmeta) {
        delete propertyValue.chainmeta;
    }

    if (!options.confirmations) {
        delete propertyValue.confirmations;
    }

    if (options.confirmations || options.withChainmeta) {
        return propertyValue;
    }

    if (!propertyValue.data) {
        throw new Error("Internal error, data attribute could not be undefined");
    }

    return propertyValue.data;
};

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

export const getCurrentPioneerBadge = async (client: UNSClient): Promise<string | undefined> => {
    if (getUTCTime().isBefore(getUTCTime("2021-01-01"))) {
        return PioneerBadgeGrades.INNOVATOR.toString();
    }
    const nftStatus: ResponseWithChainMeta<INftStatus[]> = await client.nft.status();
    const nbUniks = nftStatus.data?.find(status => status.nftName === "UNIK");

    if (nbUniks) {
        const totalUniks = parseInt(nbUniks.individual) + parseInt(nbUniks.organization) + parseInt(nbUniks.network);
        if (totalUniks <= PIONEER_EARLY_ADOPTER_LIMIT) {
            return PioneerBadgeGrades.EARLY_ADOPTER.toString();
        }
    }
    return;
};

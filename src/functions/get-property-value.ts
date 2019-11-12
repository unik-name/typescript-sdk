import { ResponseWithChainMeta, UNSClient, Network, PropertyValue } from "..";
import { merge, getPropertyValueWithChainmeta } from "../utils";

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
    network: Network,
    opts: PropertyOptions = defaultPropertyOptions,
): Promise<ResponseWithChainMeta<PropertyValue> | PropertyValue> => {
    const options: PropertyOptions = merge(defaultPropertyOptions, opts);

    const client = new UNSClient(network);

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

    return options.confirmations || options.withChainmeta ? propertyValue : propertyValue.data;
};
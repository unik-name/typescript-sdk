import { PropertyValue, ResponseWithChainMeta, UNSClient } from "..";
import { getPropertyValueWithChainmeta, merge } from "../utils";

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
    const options: PropertyOptions = merge(defaultPropertyOptions, opts);

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

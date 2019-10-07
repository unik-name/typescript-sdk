import { UNSClient } from "..";
import { NetworkConfig } from "../clients/uns/config";
import { escapeHtml } from "../utils";
import { ResourceWithChainMeta } from "../clients/uns/resources";
import { getPropertyValue as getPropertyValueWithChainmeta } from "../utils/resource-helper";

export type PropertyOptions = {
    withChainmeta?: boolean;
    confirmations?: boolean;
    disableHtmlEscape?: boolean;
    network?: string;
};

const defaultPropertyOptions = {
    withChainmeta: false,
    confirmations: false,
    disableHtmlEscape: false,
    network: "DEVNET",
};

export const getPropertyValue = async (
    unikid: string,
    propertyKey: string,
    opts: PropertyOptions = {},
): Promise<ResourceWithChainMeta<string> | string> => {
    const options: PropertyOptions = Object.assign({}, defaultPropertyOptions, opts);

    const selectedNetwork = NetworkConfig[options.network.toUpperCase()];
    const client = new UNSClient(selectedNetwork);

    const propertyValue: ResourceWithChainMeta<string> = await getPropertyValueWithChainmeta(
        unikid,
        propertyKey,
        client,
        options.confirmations,
    );

    if (propertyValue.data && options.disableHtmlEscape) {
        propertyValue.data = escapeHtml(propertyValue.data);
    }

    if (!options.withChainmeta) {
        delete propertyValue.chainmeta;
    }

    if (!options.confirmations) {
        delete propertyValue.confirmations;
    }

    return options.confirmations || options.withChainmeta ? propertyValue : propertyValue.data;
};

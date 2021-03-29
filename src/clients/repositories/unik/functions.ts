import { PropertyValue, Unik, UnikProperties } from "./types";
import { isActiveProperty, escapeSlashes } from "./utils";
import { HTTPClient, ResponseWithChainMeta, Response } from "../..";
import { get, post } from "../network-repository";

export const unikGet = (client: HTTPClient) => (id: string): Promise<ResponseWithChainMeta<Unik>> =>
    get<ResponseWithChainMeta<Unik>>(client)(`uniks/${id}`);

export const unikProperties = (client: HTTPClient) => (
    id: string,
    onlyActiveBadge: boolean = true,
): Promise<ResponseWithChainMeta<UnikProperties>> =>
    get<ResponseWithChainMeta<UnikProperties>>(client)(`uniks/${id}/properties`).then(response => {
        if (onlyActiveBadge) {
            response.data = response.data?.filter(isActiveProperty);
        }
        return response;
    });

export const unikProperty = (client: HTTPClient) => (
    id: string,
    key: string,
): Promise<ResponseWithChainMeta<PropertyValue>> => {
    const escapedKey: string = escapeSlashes(key);
    return get<ResponseWithChainMeta<PropertyValue>>(client)(`uniks/${id}/properties/${escapedKey}`);
};

export const unikSearch = (client: HTTPClient) => (ids: string[]): Promise<Response<Unik[]>> =>
    post<Response<Unik[]>>(client)("uniks/search", undefined, { id: ids });

export const unikTotalCount = (client: HTTPClient) => (): Promise<number> =>
    get<ResponseWithChainMeta<Unik[]>>(client)("uniks", { limit: 1 }).then(r => r.meta?.totalCount || 0);

import { HTTPClient } from "../..";
import { UNSEndpoint } from "../../config";
import { _Body, _Params } from "../../http/client";

export const get = <T>(client: HTTPClient) => (path: string, queryParams?: _Params): Promise<T> =>
    client.get<T>(UNSEndpoint.network, path, queryParams);

export const post = <T>(client: HTTPClient) => (path: string, queryParams?: _Params, body?: _Body): Promise<T> =>
    client.post(UNSEndpoint.network, path, queryParams, body);

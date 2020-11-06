import { HTTPClient } from "../..";
import { UNSEndpoint } from "../../config";
import { _Params } from "../../http/client";

export const get = <T>(client: HTTPClient) => (path: string, params?: _Params): Promise<T> =>
    client.get<T>(UNSEndpoint.network, path, params);

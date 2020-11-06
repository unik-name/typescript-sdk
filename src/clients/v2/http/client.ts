import { DEFAULT_UNS_CONFIG, UNSConfig, UNSEndpoint } from "../config";
import { merge } from "../../../utils";
import ky, { ResponsePromise, Options } from "ky-universal";
import { Network } from "../../..";

export type _Body = Record<string, any>;
export type _Headers = Record<string, string>;
export type _Params = Record<string, any>;
type IHTTPResponse<T> = {
    body: T;
    headers: Headers;
    status: number;
};
type IHTTPRequest = {
    method: Method;
    url: string;
    opts?: Options;
};
type Method = "get" | "post";

export class HTTPClient {
    public readonly config: UNSConfig;
    public constructor(conf?: Partial<UNSConfig>) {
        this.config = conf ? merge(DEFAULT_UNS_CONFIG, conf) : DEFAULT_UNS_CONFIG;
    }

    public set network(network: Network) {
        this.config.network = network;
    }

    public post<T>(
        endpoint: UNSEndpoint,
        path: string,
        queryParams?: _Params,
        body?: _Body,
        headers?: _Headers,
    ): Promise<T> {
        const preparedRequest = this.prepareRequest("post", endpoint, path, queryParams, body, headers);
        const response = this.send<T>(preparedRequest);
        return this.prepareResponse(response);
    }

    public get<T>(endpoint: UNSEndpoint, path: string, queryParams?: _Params, headers?: _Headers): Promise<T> {
        const preparedRequest = this.prepareRequest("get", endpoint, path, queryParams, undefined, headers);
        const response = this.send<T>(preparedRequest);
        return this.prepareResponse(response);
    }

    private prepareRequest(
        method: Method,
        endpoint: UNSEndpoint,
        path: string,
        queryParams?: _Params,
        body?: _Body,
        headers?: _Headers,
    ): IHTTPRequest {
        const url = this.buildURL(endpoint, path, queryParams);
        const requestHeaders =
            headers || this.config.defaultHeaders ? merge(this.config.defaultHeaders, headers) : undefined;
        const requestBody = body ? JSON.stringify(body) : undefined;
        return { method, url, opts: { body: requestBody, headers: requestHeaders } };
    }
    private prepareResponse<T>(response: Promise<IHTTPResponse<T>>): Promise<T> {
        return response.then(r => r.body);
    }
    private buildURL(endpoint: UNSEndpoint, path: string, params?: _Params): string {
        const base: string = this.config.endpoints[this.config.network][endpoint];
        const url = new URL(path, base);
        if (params) {
            Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
        }
        return url.href;
    }

    private async send<T>({ method, url, opts }: IHTTPRequest): Promise<IHTTPResponse<T>> {
        const response: ResponsePromise = ky[method](url, opts);
        const body = await response.json<T>();
        const { headers, status } = await response;

        return { body, headers, status };
    }
}

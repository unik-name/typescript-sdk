import { DEFAULT_UNS_CONFIG, Network, UNSConfig, UNSEndpoint } from "../config";
import ky, { Options } from "ky-universal";
import { DeepPartial, merge } from "../../utils/merge";

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
    public constructor(conf?: DeepPartial<UNSConfig>) {
        this.config = merge(DEFAULT_UNS_CONFIG, conf);
    }

    public setNetwork(network: Network) {
        this.config.network = network;
    }

    public setCustomEndpoint(endpoint: UNSEndpoint, value: string): void {
        this.config.endpoints[this.config.network][endpoint] = value;
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
        const requestHeaders = merge<_Headers>(this.config.defaultHeaders, headers);
        const requestBody = body ? JSON.stringify(body) : undefined;
        return { method, url, opts: { body: requestBody, headers: requestHeaders, timeout: 15000 } };
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
        const response = await ky[method](url, opts);
        const { headers, status } = response;
        const body = await response.json();

        return { body, headers, status };
    }
}

import { DEFAULT_UNS_CONFIG, UNSConfig, UNSEndpoint } from "../config";
import { merge } from "../../../utils";
import ky, { ResponsePromise, Options } from "ky-universal";

export type _Body = Record<string, any>;
export type _Headers = Record<string, string>;
type Params = Record<string, any>;
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
    constructor(public readonly config: UNSConfig = DEFAULT_UNS_CONFIG) {}

    public post<T>(endpoint: UNSEndpoint, path: string, body?: _Body, headers?: _Headers): Promise<T> {
        const preparedRequest = this.prepareRequest("post", endpoint, path, body, headers);
        const response = this.send<T>(preparedRequest);
        return this.prepareResponse(response);
    }
    private prepareRequest(
        method: Method,
        endpoint: UNSEndpoint,
        path: string,
        body?: _Body,
        headers?: _Headers,
    ): IHTTPRequest {
        const url = this.buildURL(endpoint, path);
        const requestHeaders = merge(this.config.defaultHeaders, headers);
        const requestBody = JSON.stringify(body);
        return { method, url, opts: { body: requestBody, headers: requestHeaders } };
    }
    private prepareResponse<T>(response: Promise<IHTTPResponse<T>>): Promise<T> {
        return response.then(r => r.body);
    }
    private buildURL(endpoint: UNSEndpoint, path: string, params?: Params): string {
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

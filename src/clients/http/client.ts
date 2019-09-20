/* eslint-disable max-classes-per-file */

import ky, { ResponsePromise } from "ky-universal";
import { HTTPError } from "./error";
import { HTTPOptions } from "./options";
import { IHTTPResponse } from "./response";

class HTTPClient {
    public async get<T = any>(url: string, opts?: HTTPOptions): Promise<IHTTPResponse<T>> {
        return this.sendRequest("get", url, opts);
    }

    public async post<T = any>(url: string, opts?: HTTPOptions): Promise<IHTTPResponse<T>> {
        return this.sendRequest("post", url, opts);
    }

    public async put<T = any>(url: string, opts?: HTTPOptions): Promise<IHTTPResponse<T>> {
        return this.sendRequest("put", url, opts);
    }

    public async patch<T = any>(url: string, opts?: HTTPOptions): Promise<IHTTPResponse<T>> {
        return this.sendRequest("patch", url, opts);
    }

    public async head<T = any>(url: string, opts?: HTTPOptions): Promise<IHTTPResponse<T>> {
        return this.sendRequest("head", url, opts);
    }

    public async delete<T = any>(url: string, opts?: HTTPOptions): Promise<IHTTPResponse<T>> {
        return this.sendRequest("delete", url, opts);
    }

    private async sendRequest<T>(method: string, url: string, opts: HTTPOptions = {}): Promise<IHTTPResponse<T>> {
        if (opts.body && typeof opts !== "string") {
            opts.body = JSON.stringify(opts.body);
        }

        // Do not retry unless explicitly stated.
        if (!opts.retry) {
            opts.retry = { retries: 0 };
        }

        try {
            const response: ResponsePromise = ky[method](url, opts);
            const body = (await response.json()) as T;
            const { headers, status } = await response;

            return { body, headers, status };
        } catch (error) {
            // No way to parse error correctly to throw specific error...
            if (error && error.name === "HTTPError") {
                console.debug(error.toString(), url, opts);
                throw error;
            }

            throw new HTTPError(error);
        }
    }
}

export const httpClient = new HTTPClient();

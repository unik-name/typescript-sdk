import { HTTPError } from "ky-universal";
import { http } from "../clients/http";
import { Config, EndpointsConfig, UNSClientConfig } from "../config";
import { codes } from "../types/errors";
import { computeRequestUrl, join, merge } from "../utils";
import { Response } from "./response";

export abstract class Repository {
    protected endpointsConfig: EndpointsConfig;

    protected globalConfig: UNSClientConfig;

    protected url: string;

    private readonly defaultHeaders = {
        "content-type": "application/json",
    };

    constructor(endpointsConfig: EndpointsConfig, globalConfig: UNSClientConfig) {
        this.endpointsConfig = endpointsConfig;
        this.globalConfig = globalConfig;

        const result = this.computeUrls();

        this.getEndpoint().url = result.endpointUrl;
        this.url = result.repositoryUrl;
    }

    protected async GET<T>(path: string, query?: string): Promise<T> {
        return (
            await http.get<T>(computeRequestUrl(this.url, path, query), {
                headers: this.getAllHeaders(),
            })
        ).body;
    }

    protected async POST<T>(body: any = {}, path: string = ""): Promise<T> {
        return (
            await http.post<T>(computeRequestUrl(this.url, path), {
                body,
                headers: this.getAllHeaders(),
            })
        ).body;
    }

    private getAllHeaders(): { [_: string]: string } {
        // Priority:
        // 1. headers provided by SDK user
        // 2. headers provided by repository
        // 3. default headers
        return merge(this.defaultHeaders, merge(this.headers, this.globalConfig.headers));
    }

    protected abstract sub(): string;

    protected abstract getEndpoint(): Config;

    /**
     * Just push new entries to add custom header to a repository
     */
    protected readonly headers: { [_: string]: string } = {};

    protected async withHttpErrorsHandling<T>(fn: () => Promise<Response<T>>): Promise<Response<T>> {
        try {
            return await fn();
        } catch (error) {
            if (error instanceof HTTPError && [400].includes(error.response.status)) {
                // try to detect JSONAPI error format
                const contentTypeHeader: string | null = error.response.headers.get("content-type");
                if (contentTypeHeader && contentTypeHeader.includes("application/vnd.api+json")) {
                    const body = await error.response.json();
                    if (body.errors) {
                        if (Array.isArray(body.errors)) {
                            const errors = body.errors as any[];
                            if (errors.length === 1) {
                                const firstError = errors[0];
                                return {
                                    error: {
                                        message: firstError.title,
                                        code: firstError.code,
                                    },
                                };
                            } else {
                                // TODO someday when necessary
                                throw new Error("UNS SDK: the requested remote services is not JSON API compatible");
                            }
                        } else {
                            // TODO someday when necessary
                            throw new Error("UNS SDK: the requested remote services is not JSON API compatible");
                        }
                    }
                }

                return {
                    error: {
                        code: codes.HTTP_ERROR_RECEIVED.code,
                        message: error.message,
                    },
                };
            } else {
                throw error;
            }
        }
    }

    private computeUrls() {
        const endpointUrl = new URL(this.getEnpointSuffix(), this.getEndpoint().url).toString();
        // /!\ if you try to use URL(...) with the previous 'this.getEndpoint().url',
        // Some parts of the full URL will be missing
        const repositoryUrl = new URL(join(this.getEnpointSuffix(), this.sub()), this.getEndpoint().url).toString();

        return { endpointUrl, repositoryUrl };
    }

    protected abstract getEnpointSuffix(): string;
}

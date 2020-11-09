import { HTTPError } from "ky-universal";
import { codes } from "./constants";
import { HTTPClient, Response } from "../../http";
import { _Body, _Headers, _Params } from "../../http/client";
import { UNSEndpoint } from "../../config";

const defaultHeaders = (client: HTTPClient): _Headers => ({
    "Uns-Network": client.config.network,
});

export const get = <T>(client: HTTPClient) => (path: string, queryParams?: _Params): Promise<Response<T>> =>
    client.get<T>(UNSEndpoint.services, path, queryParams, defaultHeaders(client)).catch(e => handleBadRequest<T>(e));

export const post = <T>(client: HTTPClient) => (
    path: string,
    queryParams?: _Params,
    body?: _Body,
): Promise<Response<T>> =>
    client
        .post<T>(UNSEndpoint.services, path, queryParams, body, defaultHeaders(client))
        .catch(e => handleBadRequest<T>(e));

const handleBadRequest = async <T>(error: any): Promise<Response<T>> => {
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
};

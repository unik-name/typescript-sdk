import deepmerge = require("deepmerge");

export * from "./chainmeta";

export function join(...toJoin: string[]) {
    return toJoin.join("/");
}

export function escapeSlashes(toEscape: string): string {
    return toEscape.replace(/\//g, "%2F");
}

export function merge<T>(a: Partial<T>, b: Partial<T>): T {
    return deepmerge(a || {}, b || {}) as T;
}

export function computeRequestUrl(baseUrl: string, path: string, query?: string): string {
    let requestUrl: string = baseUrl;

    if (path) {
        requestUrl = join(requestUrl, path);
    }

    if (query) {
        requestUrl = `${requestUrl}?${query}`;
    }

    return requestUrl;
}

export function getCurrentIAT() {
    return Math.floor(Date.now() / 1000);
}

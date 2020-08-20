import deepmerge = require("deepmerge");
import dayjs from "dayjs";

export * from "./chainmeta";

export function join(...toJoin: string[]) {
    return toJoin.join("/");
}

export function escapeSlashes(toEscape: string): string {
    return toEscape.replace(/\//g, "%2F");
}

/**
 * According to [`deepmerge#merge` specifications](https://www.npmjs.com/package/deepmerge#mergex-y-options)
 * priority is given to the second argument (`b` here)
 */
export function merge<T>(a: Partial<T> | undefined, b: Partial<T> | undefined): T {
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
    return dayjs().unix();
}

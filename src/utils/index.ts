import deepmerge = require("deepmerge");

export * from "./chainmeta";

export function join(...toJoin: string[]) {
    return toJoin.join("/");
}

export function merge<T>(a: Partial<T>, b: Partial<T>): T {
    return deepmerge(a || {}, b || {}) as T;
}

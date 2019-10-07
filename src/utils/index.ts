import deepmerge = require("deepmerge");

export function join(...toJoin: string[]) {
    return toJoin.join("/");
}

export function merge<T>(a, b): T {
    return deepmerge(a || {}, b || {}) as T;
}

/**
 * Escape HTML characters
 * @param input
 */
export function escapeHtml(input: string): string {
    return escape(input);
}

import deepmerge from "deepmerge";

/**
 * According to [`deepmerge#merge` specifications](https://www.npmjs.com/package/deepmerge#mergex-y-options)
 * priority is given to the second argument (`b` here)
 */
export function merge<T>(a: Partial<T> | undefined, b: Partial<T> | undefined): T {
    return deepmerge(a || {}, b || {}) as T;
}

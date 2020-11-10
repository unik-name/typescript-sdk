import deepmerge from "deepmerge";
export type DeepPartial<T> = Partial<T> &
    {
        [P in keyof T]?: DeepPartial<T[P]>;
    };

/**
 * According to [`deepmerge#merge` specifications](https://www.npmjs.com/package/deepmerge#mergex-y-options)
 * priority is given to the second argument (`b` here)
 */
export const merge = <T>(a: DeepPartial<T> = {}, b: DeepPartial<T> = {}): T => deepmerge(a, b) as T;

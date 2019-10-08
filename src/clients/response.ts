import { ChainMeta } from "../types";

export interface FunctionalError {
    message: string;
}

export type Response<T> = {
    data?: T;
    error?: FunctionalError;
};

export type ResponseWithChainMeta<T> = Response<T> & {
    chainmeta: ChainMeta;
};

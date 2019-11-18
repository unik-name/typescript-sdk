import { ChainMeta } from "../types";

export interface FunctionalError {
    message: string;
}

export type ApiMeta = {
    count: number;
    pageCount: number;
    totalCount: number;
    next?: string;
    previous?: string;
    self: string;
    first: string;
    last: string;
};

export type Response<T> = {
    meta?: ApiMeta;
    data?: T;
    error?: FunctionalError;
};

export type ResponseWithChainMeta<T> = Response<T> & {
    chainmeta: ChainMeta;
    confirmations?: number;
};

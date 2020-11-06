export interface FunctionalError {
    message: string;
    code: string;
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

export type ChainTimestamp = {
    epoch: number;
    unix: number;
    human: string;
};

export type ChainMeta = {
    height: string;
    timestamp: ChainTimestamp;
};

export type ResponseWithChainMeta<T> = Response<T> & {
    chainmeta: ChainMeta;
    confirmations?: number;
};

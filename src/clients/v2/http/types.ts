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

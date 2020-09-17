export type PaginationOptions = {
    page?: number;
    limit?: number;
};

export const toQueryString = (pagination?: PaginationOptions) =>
    Object.entries(pagination || {})
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

export interface IHTTPResponse<T> {
    body: T;
    headers: Headers;
    status: number;
}

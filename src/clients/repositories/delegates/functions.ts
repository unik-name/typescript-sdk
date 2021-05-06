import { HTTPClient, Response } from "../..";
import { Delegate } from "./types";
import { get } from "../network-repository";

export const delegatesAll = (client: HTTPClient) => (): Promise<Response<Delegate[]>> =>
    get<Response<Delegate[]>>(client)("delegates");

export const delegatesGet = (client: HTTPClient) => (id: string): Promise<Response<Delegate | undefined>> =>
    get<Response<Delegate>>(client)(`delegates/${id}`);

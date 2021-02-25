import { HTTPClient, Response } from "../..";
import { Block } from "./types";
import { get } from "../network-repository";
import { Transaction } from "../transactions/types";

export const blockLast = (client: HTTPClient) => (): Promise<Response<Block>> =>
    get<Response<Block>>(client)("blocks/last");

export const transactions = (client: HTTPClient) => (id: string): Promise<Response<Transaction[]>> =>
    get<Response<Transaction[]>>(client)(`blocks/${id}/transactions`);

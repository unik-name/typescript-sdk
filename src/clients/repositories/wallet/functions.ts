import { Tokens, Wallet } from "./types";
import { HTTPClient, ResponseWithChainMeta } from "../..";
import { get, post } from "../network-repository";
import { _Params } from "../../http/client";

export const walletGet = (client: HTTPClient) => (id: string): Promise<ResponseWithChainMeta<Wallet>> =>
    get<ResponseWithChainMeta<Wallet>>(client)(`wallets/${id}`);

export const walletTokens = (client: HTTPClient) => (
    id: string,
    nftName: string = "unik",
): Promise<ResponseWithChainMeta<Tokens>> => get<ResponseWithChainMeta<Tokens>>(client)(`wallets/${id}/${nftName}s`);

export const walletSearch = (client: HTTPClient) => (searchQuery: _Params): Promise<ResponseWithChainMeta<Wallet[]>> =>
    post<ResponseWithChainMeta<Wallet[]>>(client)("wallets/search", undefined, searchQuery);

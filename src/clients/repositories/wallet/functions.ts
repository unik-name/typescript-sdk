import { Tokens, Wallet } from "./types";
import { HTTPClient, ResponseWithChainMeta } from "../..";
import { get } from "../network-repository";

export const walletGet = (client: HTTPClient) => (id: string): Promise<ResponseWithChainMeta<Wallet>> =>
    get<ResponseWithChainMeta<Wallet>>(client)(`wallets/${id}`);

export const walletTokens = (client: HTTPClient) => (
    id: string,
    nftName: string = "unik",
): Promise<ResponseWithChainMeta<Tokens>> => get<ResponseWithChainMeta<Tokens>>(client)(`wallets/${id}/${nftName}s`);

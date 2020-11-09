import { HTTPClient, ResponseWithChainMeta } from "../..";
import { get } from "../network-repository";
import { INftStatus } from "./types";

export const nftsStatus = (client: HTTPClient) => (): Promise<ResponseWithChainMeta<INftStatus[]>> =>
    get<ResponseWithChainMeta<INftStatus[]>>(client)("nfts/status");

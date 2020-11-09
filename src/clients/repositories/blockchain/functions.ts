import { HTTPClient, Response } from "../..";
import { BlockchainState } from "./types";
import { get } from "../network-repository";

export const blockchainGet = (client: HTTPClient) => (): Promise<Response<BlockchainState>> =>
    get<Response<BlockchainState>>(client)("blockchain");

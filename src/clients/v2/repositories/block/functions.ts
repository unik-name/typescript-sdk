import { HTTPClient, Response } from "../..";
import { Block } from "./types";
import { get } from "../network-repository";

export const blockLast = (client: HTTPClient) => (): Promise<Response<Block>> =>
    get<Response<Block>>(client)("blocks/last");

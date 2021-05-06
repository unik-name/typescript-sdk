import { HTTPClient, Response } from "../..";
import { RoundDelegate } from "./types";
import { get } from "../network-repository";

export const roundsGetDelegates = (client: HTTPClient) => (roundId: number): Promise<Response<RoundDelegate[]>> =>
    get<Response<RoundDelegate[]>>(client)(`rounds/${roundId}/delegates`);

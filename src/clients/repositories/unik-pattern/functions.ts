import { HTTPClient, Response } from "../..";
import { post } from "../service-repository";
import { UnikPattern, UnikPatterRequestBody } from "./types";

export const unikPatternCompute = (client: HTTPClient) => (
    parameters: UnikPatterRequestBody,
): Promise<Response<UnikPattern>> => post<UnikPattern>(client)("unik-pattern", undefined, parameters);

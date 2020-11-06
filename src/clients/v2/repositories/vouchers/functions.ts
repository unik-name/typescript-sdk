import { HTTPClient, Response } from "../..";
import { post } from "../service-repository";
import { UnikVoucherRequestBody, UnikVoucherResult } from "./types";

export const voucherCreate = (client: HTTPClient) => (
    parameters: UnikVoucherRequestBody,
): Promise<Response<UnikVoucherResult>> => post<UnikVoucherResult>(client)("unik-vouchers", undefined, parameters);

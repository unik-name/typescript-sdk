import { Interfaces, Transactions } from "@uns/ark-crypto";
import { IProcessorResult, Transaction } from "./types";
import { HTTPClient, PaginationOptions, ResponseWithChainMeta } from "../..";
import { get, post } from "../network-repository";
import { _Body } from "../../http/client";

export const transactionsGet = (client: HTTPClient) => (id: string): Promise<ResponseWithChainMeta<Transaction>> =>
    get<ResponseWithChainMeta<Transaction>>(client)(`transactions/${id}`);

export const transactionsSend = (client: HTTPClient) => (
    transaction: Interfaces.ITransactionData,
): Promise<IProcessorResult> => {
    let validation;
    try {
        validation = Transactions.Verifier.verifySchema(transaction);
    } catch (e) {
        // Unknown transaction type
        // Could happen in dev environment
    }
    if (validation?.error) {
        throw new Error(validation.error);
    }
    return post<IProcessorResult>(client)(`transactions`, undefined, { transactions: [transaction] });
};

export const transactionsSearch = (client: HTTPClient) => (
    body: _Body,
    pagination: PaginationOptions = {},
): Promise<ResponseWithChainMeta<Transaction[]>> =>
    post<ResponseWithChainMeta<Transaction[]>>(client)("transactions/search", { ...pagination }, body);

export const transactionsUnconfirmed = (client: HTTPClient) => (
    pagination: PaginationOptions = {},
): Promise<ResponseWithChainMeta<Transaction[]>> =>
    get<ResponseWithChainMeta<Transaction[]>>(client)("transactions/unconfirmed", { ...pagination });

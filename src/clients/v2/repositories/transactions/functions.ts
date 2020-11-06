import { Interfaces, Transactions } from "@uns/ark-crypto";
import { IProcessorResult, Transaction } from "./types";
import { HTTPClient, PaginationOptions, ResponseWithChainMeta } from "../..";
import { get, post } from "../network-repository";
import { _Params } from "../../http/client";

export const transactionsGet = (client: HTTPClient) => (id: string): Promise<ResponseWithChainMeta<Transaction>> =>
    get<ResponseWithChainMeta<Transaction>>(client)(`transactions/${id}`);

export const transactionsSend = (client: HTTPClient) => (
    transaction: Interfaces.ITransactionData,
): Promise<IProcessorResult> => {
    const { error } = Transactions.Verifier.verifySchema(transaction);
    if (error) {
        throw new Error(error);
    }
    return post<IProcessorResult>(client)(`transactions`, undefined, { transactions: [transaction] });
};

export const transactionsSearch = (client: HTTPClient) => (
    searchQuery: _Params,
): Promise<ResponseWithChainMeta<Transaction[]>> =>
    post<ResponseWithChainMeta<Transaction[]>>(client)("transactions/search", searchQuery);

export const transactionsUnconfirmed = (client: HTTPClient) => (
    pagination: PaginationOptions = {},
): Promise<ResponseWithChainMeta<Transaction[]>> =>
    get<ResponseWithChainMeta<Transaction[]>>(client)("transactions/unconfirmed", { ...pagination });

import { Interfaces } from "@uns/ark-crypto";
import { ResponseWithChainMeta } from "../response";
import { ChainTimestamp } from "../../types";
import { ChainRepository } from "./types/ChainRepository";
import { PaginationOptions, toQueryString } from "../http/pagination";

export const TRANSACTION_REPOSITORY_SUB: string = "transactions";

export type Transaction = Interfaces.ITransactionData & {
    sender?: string;
    recipient?: string;
    timestamp?: ChainTimestamp;
    confirmations?: number;
};

export type IProcessorResult = {
    data: {
        accept: string[];
        broadcast: string[];
        invalid: string[];
        excess: string[];
    };
    errors:
        | {
              [key: string]: ITransactionErrorResponse[];
          }
        | undefined;
};
export type ITransactionErrorResponse = {
    type: string;
    message: string;
};

export class TransactionRepository extends ChainRepository {
    protected sub(): string {
        return TRANSACTION_REPOSITORY_SUB;
    }

    public async get(id: string): Promise<ResponseWithChainMeta<Transaction>> {
        return this.GET<ResponseWithChainMeta<Transaction>>(`${id}`);
    }

    public async send(transaction: Interfaces.ITransactionData): Promise<IProcessorResult> {
        return this.POST<IProcessorResult>({ transactions: [transaction] });
    }

    public async search(searchQuery: { [_: string]: any }): Promise<ResponseWithChainMeta<Transaction[]>> {
        return this.POST<ResponseWithChainMeta<Transaction[]>>(searchQuery, "search");
    }

    public async unconfirmed(pagination?: PaginationOptions): Promise<ResponseWithChainMeta<Transaction[]>> {
        return this.GET<ResponseWithChainMeta<Transaction[]>>("unconfirmed", toQueryString(pagination));
    }
}

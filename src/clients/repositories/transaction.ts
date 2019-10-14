import { ResponseWithChainMeta } from "../response";
import { ChainTimestamp } from "../../types";
import { ChainRepository } from "./types/ChainRepository";

export const TRANSACTION_REPOSITORY_SUB: string = "transactions";

export type Transaction = {
    id: string;
    confirmations: number;
    timestamp: ChainTimestamp;
};

export class TransactionRepository extends ChainRepository {
    protected sub(): string {
        return TRANSACTION_REPOSITORY_SUB;
    }

    public async get(id: string): Promise<ResponseWithChainMeta<Transaction>> {
        return this.GET<ResponseWithChainMeta<Transaction>>(`${id}`);
    }
}

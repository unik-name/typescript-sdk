import { Repository } from "../../repository";
import { ResponseWithChainMeta } from "../../response";
import { ChainTimestamp } from "../../../types";

export const TransactionRepositorySub: string = "transactions";

export type Transaction = {
    id: string;
    confirmations: number;
    timestamp: ChainTimestamp;
};

export class TransactionRepository extends Repository {
    protected sub(): string {
        return TransactionRepositorySub;
    }

    public async get(id: string): Promise<ResponseWithChainMeta<Transaction>> {
        return this.GET<ResponseWithChainMeta<Transaction>>(`${id}`);
    }
}

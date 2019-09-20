/* eslint-disable max-classes-per-file */

import { ChainTimestamp } from "../../../types/chainmeta";
import { HTTPOptions } from "../../http";
import { Resource, ResourceWithChainMeta } from "./resource";

export interface Transaction {
    id: string;
    confirmations: number;
    timestamp: ChainTimestamp;
}

export class TransactionResource extends Resource {
    public static PATH: string = "transactions";

    public path(): string {
        return TransactionResource.PATH;
    }

    public async transaction(transactionId: string, opts?: HTTPOptions): Promise<ResourceWithChainMeta<Transaction>> {
        return this.sendGetWithChainMeta<Transaction>(transactionId, opts);
    }
}

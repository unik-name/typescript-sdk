import { Interfaces } from "@uns/ark-crypto";
import { ChainTimestamp } from "../../http";

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

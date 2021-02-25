import { ChainTimestamp } from "../..";

export type Block = {
    id: string;
    height: number;
    timestamp: ChainTimestamp;
    transactions: number;
};

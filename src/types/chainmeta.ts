export type ChainTimestamp = {
    epoch: number;
    unix: number;
    human: string;
};

export type ChainMeta = {
    height: string;
    timestamp: ChainTimestamp;
};

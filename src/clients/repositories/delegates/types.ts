import { Block } from "../block";

export enum ForgingStatus {
    Forging,
    Missing,
    NotForging,
    NeverForged,
    BecameActive,
}

export type Delegate = {
    address: string;
    username: string;
    type: string;
    publicKey: string;
    blocks: {
        produced: number;
        last: Block;
    };
    votes: string;
    rank: number;
    production: {
        approval: number;
    };
    forged: {
        fees: number;
        rewards: number;
        total: number;
    };
    forgingStatus: ForgingStatus;
    isResigned?: true;
};

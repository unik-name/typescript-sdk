import { Response } from "../response";
import { ChainRepository } from "./types/ChainRepository";
import { Interfaces } from "@uns/ark-crypto";

export const NODE_REPOSITORY_SUB: string = "node";

export type NodeStatus = {
    synced: boolean;
    now: number;
    blocksCount: number;
};

export type NodeConfiguration = {
    nethash: string;
    slip44: number;
    wif: number;
    token: string;
    symbol: string;
    explorer: string;
    version: number;
    port: { [_: string]: number };
    constants: {
        height: number;
        reward: number;
        activeDelegates: number;
        blocktime: number;
        block: {
            version: number;
            maxTransactions: number;
            maxPayload: number;
        };
        epoch: string;
        fees: {
            staticFees: { [_: string]: number };
        };
        ignoreInvalidSecondSignatureField: boolean;
        vendorFieldLength: number;
        urlCheckers?: string[];
    };
    feeStatistics: {
        type: number;
        fees: {
            minFee: number;
            maxFee: number;
            avgFee: number;
        };
    }[];
    transactionPool: {
        maxTransactionAge: number;
        dynamicFees: {
            enabled: boolean;
            minFeePool: number;
            minFeeBroadcast: number;
            addonBytes: { [_: string]: number };
        };
    };
};

export class NodeRepository extends ChainRepository {
    public async status(): Promise<Response<NodeStatus>> {
        return this.GET<Response<NodeStatus>>("status");
    }

    public async configuration(): Promise<Response<NodeConfiguration>> {
        return this.GET<Response<NodeConfiguration>>("configuration");
    }

    public async configurationCrypto(): Promise<Response<Interfaces.INetworkConfig>> {
        return this.GET<Response<Interfaces.INetworkConfig>>("configuration/crypto");
    }

    protected sub(): string {
        return NODE_REPOSITORY_SUB;
    }
}

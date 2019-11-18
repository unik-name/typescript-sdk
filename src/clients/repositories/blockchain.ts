import { Response } from "../response";
import { ChainRepository } from "./types/ChainRepository";

export const BLOCKCHAIN_REPOSITORY_SUB: string = "blockchain";

export type BlockchainState = {
    block: {
        height: number;
        id: string;
    };
    supply: number;
};

export class BlockchainRepository extends ChainRepository {
    public async get(): Promise<Response<BlockchainState>> {
        return this.GET<Response<BlockchainState>>("");
    }

    protected sub(): string {
        return BLOCKCHAIN_REPOSITORY_SUB;
    }
}

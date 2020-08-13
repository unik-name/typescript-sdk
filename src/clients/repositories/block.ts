import { Response } from "../response";
import { ChainRepository } from "./types/ChainRepository";
import { ChainTimestamp } from "../../types";

export const BLOCKS_REPOSITORY_SUB: string = "blocks";

export type Block = {
    id: string;
    height: number;
    timestamp: ChainTimestamp;
};

export class BlocksRepository extends ChainRepository {
    public async last(): Promise<Response<Block>> {
        return this.GET<Response<Block>>("last");
    }

    protected sub(): string {
        return BLOCKS_REPOSITORY_SUB;
    }
}

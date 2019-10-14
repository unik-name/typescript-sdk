import { Response } from "../response";
import { ChainRepository } from "./types/ChainRepository";

export const NODE_REPOSITORY_SUB: string = "node";

export type NodeStatus = {
    synced: boolean;
    now: number;
    blocksCount: number;
};

export class NodeRepository extends ChainRepository {
    public async status(): Promise<Response<NodeStatus>> {
        return this.GET<Response<NodeStatus>>("status");
    }

    protected sub(): string {
        return NODE_REPOSITORY_SUB;
    }
}

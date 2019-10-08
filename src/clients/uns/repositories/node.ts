import { Repository } from "../../repository";
import { Response } from "../../response";

export const NodeRepositorySub: string = "node";

export type NodeStatus = {
    synced: boolean;
    now: number;
    blocksCount: number;
};

export class NodeRepository extends Repository {
    public async status(): Promise<Response<NodeStatus>> {
        return this.GET<Response<NodeStatus>>("status");
    }

    protected sub(): string {
        return NodeRepositorySub;
    }
}

/* eslint-disable max-classes-per-file */

import { HTTPOptions } from "../../http";
import { Resource } from "./resource";

export interface NodeStatus {
    synced: boolean;
    now: number;
    blocksCount: number;
}

export class Node extends Resource {
    public static PATH: string = "node";

    public path(): string {
        return Node.PATH;
    }

    public async status(opts?: HTTPOptions): Promise<NodeStatus> {
        return this.sendGet<NodeStatus>("status", opts);
    }
}

import { APIClient, APIClientBuilder } from "../builder";
import { HTTPOptions } from "../http";
import { Config, Network, NetworkConfig } from "./config";
import { Node, Resource } from "./resources";
import { Transactions } from "./resources/transaction";
import { Uniks } from "./resources/uniks";

const DEFAULT_HEADERS: HTTPOptions = {
    "content-type": "application/json",
};

export class UNSClient {
    private api: APIClient;

    constructor(
        protected configOrNetwork: Config | Network = Network.DEVNET,
        protected defaultHeaders: HTTPOptions = DEFAULT_HEADERS,
    ) {
        const config = NetworkConfig[configOrNetwork as Network] || (configOrNetwork as Config);

        this.api = new APIClientBuilder()
            .withHost(config.endpoint)
            .withDefaultHeaders(defaultHeaders)
            .withResource(new Node())
            .withResource(new Uniks())
            .withResource(new Transactions())
            .build();
    }

    public get node(): Node {
        return this.getResource<Node>(Node.PATH);
    }

    public get uniks(): Uniks {
        return this.getResource<Uniks>(Uniks.PATH);
    }

    public get transactions(): Transactions {
        return this.getResource<Transactions>(Transactions.PATH);
    }

    private getResource<T extends Resource>(name: string): T {
        return this.api[name] as T;
    }
}

import { APIClient, APIClientBuilder } from "../builder";
import { HTTPOptions } from "../http";
import { Config, Network, NetworkConfig } from "./config";
import { Node, Resource } from "./resources";
import { TransactionResource } from "./resources/transaction";
import { Unik } from "./resources/uniks";

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
            .withResource(new Unik())
            .withResource(new TransactionResource())
            .build();
    }

    public get node(): Node {
        return this.getResource<Node>(Node.PATH);
    }

    public get uniks(): Unik {
        return this.getResource<Unik>(Unik.PATH);
    }

    public get transactions(): TransactionResource {
        return this.getResource<TransactionResource>(TransactionResource.PATH);
    }

    private getResource<T extends Resource>(name: string): T {
        return this.api[name] as T;
    }
}

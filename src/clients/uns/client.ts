import { APIClient, APIClientBuilder } from "../builder";
import { Node, Resource } from "./resources";
import { HTTPOptions } from "../http";
import { Config, Network, NetworkConfig } from "./config";

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
            .build();
    }

    public get node(): Node {
        return this.getResource<Node>(Node.PATH);
    }

    private getResource<T extends Resource>(name: string): T {
        return this.api[name] as T;
    }
}

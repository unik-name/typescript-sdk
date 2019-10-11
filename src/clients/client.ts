import { Repository } from "./repository";
import { Network, Config } from "../config";

export abstract class APIClient {
    // TODO: Find a way to hide these properties from caller
    public repositories: Record<string, Repository> = {};
    public networkConfig: Config;
    public headers = {};

    protected static DEFAULT_NETWORK: Network = Network.devnet;

    constructor(network: Network = APIClient.DEFAULT_NETWORK) {
        this.networkConfig = this.config()[network];
        this.initRepositories(this);
    }

    protected getResource<T extends Repository>(name: string): T {
        return this.repositories[name] as T;
    }

    protected abstract initRepositories(client: APIClient): void;
    protected abstract config(): Record<Network, Config>;
}

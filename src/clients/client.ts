import { Repository } from "./repository";
import { Network, Config } from "../config";

export abstract class APIClient {
    public repositories: Record<string, Repository> = {};
    public networkConfig: Config;

    constructor(network: Network = Network.devnet) {
        this.networkConfig = this.config()[network];
        this.initRepositories(this);
    }

    protected getResource<T extends Repository>(name: string): T {
        return this.repositories[name] as T;
    }

    protected abstract initRepositories(client: APIClient): void;
    protected abstract config(): Record<Network, Config>;
}

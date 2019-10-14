import { http } from "../clients/http";
import { join } from "../utils";
import { UNSClient } from "./client";
import { Network, UNSConfig } from "../config";

export abstract class Repository {
    private url: string;
    protected network: Network;

    constructor(network: Network) {
        this.network = network;
        this.url = join(UNSConfig[network][this.endpointType()].url, this.sub());
    }

    protected async GET<T>(path: string): Promise<T> {
        return (await http.get<T>(join(this.url, path), { headers: this.headers })).body;
    }

    protected async POST<T>(body: any = {}, path?: string): Promise<T> {
        return (await http.post<T>(join(this.url, path), { body, headers: this.headers })).body;
    }

    protected abstract sub(): string;

    protected abstract endpointType(): string;

    protected headers: { [_: string]: string } = {};
}

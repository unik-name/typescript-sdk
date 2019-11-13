import { http } from "../clients/http";
import { join } from "../utils";
import { Network } from "../config";
import { merge } from "../utils";
import { HTTPError } from "ky-universal";

export abstract class Repository {
    protected url: string;
    protected network: Network;

    private defaultHeaders = {
        "content-type": "application/json",
    };

    constructor(network: Network) {
        this.network = network;
        this.url = join(this.getEndpoint(network), this.sub());
    }

    protected async GET<T>(path: string): Promise<T> {
        return (await http.get<T>(join(this.url, path), { headers: merge(this.defaultHeaders, this.headers) })).body;
    }

    protected async POST<T>(body: any = {}, path: string = ""): Promise<T> {
        return (await http.post<T>(join(this.url, path), { body, headers: merge(this.defaultHeaders, this.headers) }))
            .body;
    }

    protected abstract sub(): string;

    protected abstract getEndpoint(network: Network): string;

    protected headers: { [_: string]: string } = {};

    protected async withHttpErrorsHandling<T>(fn: () => Promise<T>) {
        try {
            return await fn();
        } catch (error) {
            if (error instanceof HTTPError && [400].includes(error.response.status)) {
                return { error };
            } else {
                throw error;
            }
        }
    }
}

import { http } from "../clients/http";
import { join, merge } from "../utils";
import { APIClient } from "./client";

export abstract class Repository {
    private url: string;

    constructor(protected client: APIClient) {
        this.url = join(this.client.networkConfig.url, this.sub());
    }

    protected async GET<T>(path: string): Promise<T> {
        return (await http.get<T>(join(this.url, path), { headers: this.client.headers })).body;
    }

    protected async POST<T>(body: any = {}, path?: string): Promise<T> {
        return (await http.post<T>(join(this.url, path), { body, headers: this.client.headers })).body;
    }

    protected abstract sub(): string;
}

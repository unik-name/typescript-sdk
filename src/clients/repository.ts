import { http } from "../clients/http";
import { join } from "../utils";
import { Network, UNSConfig, Config } from "../config";
import { merge } from "../utils";
import { HTTPError } from "ky-universal";

export abstract class Repository {
    private url: string;
    protected readonly config: Config;

    private readonly defaultHeaders = {
        "content-type": "application/json",
    };

    constructor(config: Config) {
        this.config = config;
        const networkConfig = UNSConfig[this.config.network];
        this.url = join(networkConfig[this.endpointType()].url, this.sub());
    }

    protected async GET<T>(path: string): Promise<T> {
        return (await http.get<T>(join(this.url, path), { headers: this.getAllHeaders() })).body;
    }

    protected async POST<T>(body: any = {}, path?: string): Promise<T> {
        return (await http.post<T>(join(this.url, path), { body, headers: this.getAllHeaders() })).body;
    }

    private getAllHeaders(): { [_: string]: string } {
        // Priority:
        // 1. headers provided by SDK user
        // 2. headers provided by repository
        // 3. default headers
        return merge(this.defaultHeaders, merge(this.headers, this.config.headers));
    }

    protected abstract sub(): string;

    protected abstract endpointType(): string;

    /**
     * Just push new entries to add custom header to a repository
     */
    protected readonly headers: { [_: string]: string } = {};

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

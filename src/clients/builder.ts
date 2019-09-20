import isUrl = require("is-url-superb");
import { merge } from "../utils";
import { HTTPOptions } from "./http";
import { Resource } from "./uns/resources";

export type APIClient = Record<string, Resource>;
export class APIClientBuilder {
    private host: string;
    private headers?: HTTPOptions;
    private opts?: HTTPOptions;
    private resources: Record<string, Resource> = {};

    constructor() {
        // Nothing
    }

    public withHost(host: string): APIClientBuilder {
        if (!isUrl(host)) {
            throw new Error(`${host} is not a valid URL.`);
        }
        this.host = host;
        return this;
    }

    public withDefaultHeaders(headers?: HTTPOptions): APIClientBuilder {
        this.headers = headers;
        return this;
    }

    public withDefaultOptions(opts: HTTPOptions): APIClientBuilder {
        this.opts = opts;
        return this;
    }

    public withResource(resource: Resource): APIClientBuilder {
        this.resources[resource.path()] = resource;
        return this;
    }

    public build(): APIClient {
        const client: APIClient = {};

        for (const [name, resource] of Object.entries(this.resources)) {
            client[name] = resource.configure(this.host, merge(this.opts, this.headers));
        }

        return client;
    }
}

import { ChainMeta } from "../../../types/chainmeta";
import { join, merge } from "../../../utils";
import { httpClient, HTTPOptions } from "../../http";
interface ResourceData<T> {
    data: T;
}

export interface ResourceWithChainMeta<T> extends ResourceData<T> {
    chainmeta: ChainMeta;
    confirmations: number;
}

export abstract class Resource {
    protected host: string;
    protected defaultOptions?: HTTPOptions;

    public configure(host: string, defaultOptions?: HTTPOptions): Resource {
        this.host = host;
        this.defaultOptions = defaultOptions;
        return this;
    }

    public abstract path(): string;

    private get url(): string {
        return join(this.host, this.path());
    }

    private mergeOptions(options?: HTTPOptions): HTTPOptions {
        return merge<HTTPOptions>(this.defaultOptions, options);
    }

    protected async sendGet<T = any>(path: string, opts?: HTTPOptions): Promise<T> {
        return (await httpClient.get<ResourceData<T>>(join(this.url, path), this.mergeOptions(opts))).body.data;
    }

    protected async sendGetWithChainMeta<T = any>(path: string, opts?: HTTPOptions): Promise<ResourceWithChainMeta<T>> {
        return (await httpClient.get<ResourceWithChainMeta<T>>(join(this.url, path), this.mergeOptions(opts))).body;
    }

    protected async sendPost<T = any>(path: string, opts?: HTTPOptions): Promise<T> {
        return (await httpClient.post<ResourceData<T>>(join(this.url, path), this.mergeOptions(opts))).body.data;
    }
}

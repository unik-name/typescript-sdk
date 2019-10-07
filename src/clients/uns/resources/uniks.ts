/* eslint-disable max-classes-per-file */

import { HTTPOptions } from "../../http";
import { Resource, ResourceWithChainMeta } from "./resource";

export interface UnikToken {
    id: string;
    ownerId: string;
    transactions: {
        first: {
            id: string;
        };
        last: {
            id: string;
        };
    };
}

export class Uniks extends Resource {
    public static PATH: string = "uniks";

    public path(): string {
        return Uniks.PATH;
    }

    public async get(unikid: string, opts?: HTTPOptions): Promise<ResourceWithChainMeta<UnikToken>> {
        return this.sendGetWithChainMeta<UnikToken>(unikid, opts);
    }

    public async propertyValue(
        unikid: string,
        propertyKey: string,
        opts?: HTTPOptions,
    ): Promise<ResourceWithChainMeta<string>> {
        return this.sendGetWithChainMeta<string>(`${unikid}/properties/${propertyKey}`, opts);
    }
}

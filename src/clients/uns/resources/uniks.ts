/* eslint-disable max-classes-per-file */

import { UNSClient } from "../../..";
import { HTTPOptions } from "../../http";
import { Resource, ResourceWithChainMeta } from "./resource";
import { Transaction } from "./transaction";

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

export type PropertyValue = string | number;

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
    ): Promise<ResourceWithChainMeta<PropertyValue>> {
        return this.sendGetWithChainMeta<PropertyValue>(`${unikid}/properties/${propertyKey}`, opts);
    }
}

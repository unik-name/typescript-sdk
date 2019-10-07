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

    public async get(unikid: string, client: UNSClient, opts?: HTTPOptions): Promise<ResourceWithChainMeta<UnikToken>> {
        const unik = await this.sendGetWithChainMeta<UnikToken>(unikid, opts);
        const transaction = await this.getTransaction(unik.data.transactions.last.id, client);
        if (unik.chainmeta.height !== transaction.chainmeta.height) {
            throw new Error(
                `Consistency error, please retry (unik height: ${unik.chainmeta.height}, transaction height: ${transaction.chainmeta.height})`,
            );
        }
        unik.confirmations = transaction.data.confirmations;
        return unik;
    }

    public async propertyValue(
        unikid: string,
        propertyKey: string,
        client: UNSClient,
        opts?: HTTPOptions,
    ): Promise<ResourceWithChainMeta<PropertyValue>> {
        const unik = await this.get(unikid, client);
        const property = await this.sendGetWithChainMeta<PropertyValue>(`${unikid}/properties/${propertyKey}`, opts);
        // if (unik.chainmeta.height !== property.chainmeta.height) {
        //     throw new Error(
        //         `Consistency error, please retry (unik height: ${unik.chainmeta.height}, property height: ${property.chainmeta.height})`,
        //     );
        // }
        property.confirmations = unik.confirmations;
        return property;
    }

    private async getTransaction(transcationId: string, client): Promise<ResourceWithChainMeta<Transaction>> {
        return client.transactions.get(transcationId);
    }
}

import { ResponseWithChainMeta, Response } from "../response";
import { ChainRepository } from "./types/ChainRepository";
import { escapeSlashes } from "../../utils";
import { LIFE_CYCLE_PROPERTY_KEY } from "@uns/crypto";
import { BADGE_PIONEER_KEY, BADGE_XP_LEVEL_KEY, BADGE_DELEGATE_KEY, BADGE_SECOND_PASSPHRASE_KEY } from "../../types";

export const UNIK_REPOSITORY_SUB: string = "uniks";

export type Unik = {
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
    defaultExplicitValue?: string;
    explicitValues?: string;
    type?: string;
};

export type PropertyValue = string;

export const ACTIVE_BADGES = [BADGE_DELEGATE_KEY, BADGE_SECOND_PASSPHRASE_KEY, BADGE_PIONEER_KEY, BADGE_XP_LEVEL_KEY];
export const ACTIVE_SYSTEM_PROPERTIES = ["type", "explicitValues", LIFE_CYCLE_PROPERTY_KEY];

export class UnikRepository extends ChainRepository {
    private isActiveBadge(key: string): boolean {
        return ACTIVE_BADGES.includes(key);
    }

    private isActiveSystemProperty(key: string): boolean {
        return ACTIVE_SYSTEM_PROPERTIES.includes(key);
    }

    private activePropertiesFilter(propertyKey: string): boolean {
        return this.isActiveBadge(propertyKey) || this.isActiveSystemProperty(propertyKey);
    }

    public async get(id: string): Promise<ResponseWithChainMeta<Unik>> {
        return this.GET<ResponseWithChainMeta<Unik>>(`${id}`);
    }

    public async getUniks(ids: string[]): Promise<Response<Unik[]>> {
        return this.POST<Response<Unik[]>>({ id: ids }, "search");
    }

    public async totalCount(): Promise<number> {
        const uniks = await this.GET<ResponseWithChainMeta<Unik[]>>("", "limit=1");
        return uniks && uniks.meta ? uniks.meta.totalCount : 0;
    }

    public async property(id: string, key: string): Promise<ResponseWithChainMeta<PropertyValue>> {
        // Slashes have to be escaped
        const escapedKey: string = escapeSlashes(key);
        return this.GET<ResponseWithChainMeta<PropertyValue>>(`${id}/properties/${escapedKey}`);
    }

    public async properties(id: string): Promise<ResponseWithChainMeta<{ [_: string]: PropertyValue }[]>> {
        const response = await this.GET<ResponseWithChainMeta<{ [_: string]: PropertyValue }[]>>(`${id}/properties`);
        response.data = response.data?.filter(prop => this.activePropertiesFilter(Object.getOwnPropertyNames(prop)[0]));
        return response;
    }

    protected sub(): string {
        return UNIK_REPOSITORY_SUB;
    }
}

import { ResponseWithChainMeta } from "../response";
import { ChainRepository } from "./types/ChainRepository";
import { escapeSlashes } from "../../utils";

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
};

export type PropertyValue = string;

export const BADGES_PREFIX = "Badges/";
export const ACTIVE_BADGES = [`NP/Delegate`, `Security/SecondPassphrase`];

export class UnikRepository extends ChainRepository {
    private isActiveBadge(key: string): boolean {
        if (key.startsWith(BADGES_PREFIX) && !ACTIVE_BADGES.some(e => new RegExp(key).test(BADGES_PREFIX + e))) {
            return false;
        }
        return true;
    }

    public async get(id: string): Promise<ResponseWithChainMeta<Unik>> {
        return this.GET<ResponseWithChainMeta<Unik>>(`${id}`);
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
        response.data = response.data?.filter(prop => this.isActiveBadge(Object.getOwnPropertyNames(prop)[0]));
        return response;
    }

    protected sub(): string {
        return UNIK_REPOSITORY_SUB;
    }
}

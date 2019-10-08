import { Repository } from "../../repository";
import { ResponseWithChainMeta } from "../../response";

export const UnikRepositorySub: string = "uniks";

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

export class UnikRepository extends Repository {
    public async get(id: string): Promise<ResponseWithChainMeta<Unik>> {
        return this.GET<ResponseWithChainMeta<Unik>>(`${id}`);
    }

    public async property(id: string, key: string): Promise<ResponseWithChainMeta<PropertyValue>> {
        return this.GET<ResponseWithChainMeta<PropertyValue>>(`${id}/properties/${key}`);
    }

    protected sub(): string {
        return UnikRepositorySub;
    }
}

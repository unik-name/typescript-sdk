import { ResponseWithChainMeta } from "../response";
import { ChainRepository } from "./types/ChainRepository";

export const WALLET_REPOSITORY_SUB: string = "wallets";

export type Wallet = {
    address: string;
    publicKey: string;
    username?: string;
    secondPublicKey?: string;
    balance: number;
    isDelegate: boolean;
    vote?: string;
};

export class WalletRepository extends ChainRepository {
    public async get(id: string): Promise<ResponseWithChainMeta<Wallet>> {
        return this.GET<ResponseWithChainMeta<Wallet>>(`${id}`);
    }

    protected sub(): string {
        return WALLET_REPOSITORY_SUB;
    }
}

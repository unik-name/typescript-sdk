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
    nonce?: string;
};

export interface Token {
    id: string;
    ownerId: string;
}

export class WalletRepository extends ChainRepository {
    public async get(id: string): Promise<ResponseWithChainMeta<Wallet>> {
        return this.GET<ResponseWithChainMeta<Wallet>>(`${id}`);
    }

    public async tokens(id: string, nftName: string): Promise<ResponseWithChainMeta<Token[]>> {
        return this.GET<ResponseWithChainMeta<Token[]>>(`${id}/${nftName}s`);
    }

    protected sub(): string {
        return WALLET_REPOSITORY_SUB;
    }
}

import { ResponseWithChainMeta } from "../response";
import { ChainRepository } from "./types/ChainRepository";

export const NFT_REPOSITORY_SUB: string = "nfts";

export type INftStatus = {
    nftName: string;
    [_: string]: string;
};

export class NftRepository extends ChainRepository {
    /**
     * Returns NFTs' name list
     */
    public async status(): Promise<ResponseWithChainMeta<string[]>> {
        return this.GET<ResponseWithChainMeta<string[]>>("status");
    }

    protected sub(): string {
        return NFT_REPOSITORY_SUB;
    }
}

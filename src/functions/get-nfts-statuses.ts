import { Network, UNSClient } from "..";
import { INftStatus } from "../clients/repositories/nft";
import { ResponseWithChainMeta } from "../clients";

export async function getNftsStatuses(network: Network): Promise<ResponseWithChainMeta<INftStatus[]>> {
    const client = new UNSClient();
    client.init({ network });

    return await client.nft.status();
}

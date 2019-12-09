import { Network, UNSClient } from "..";
import { INftStatus } from "../clients/repositories/nft";
import { ResponseWithChainMeta } from "../clients";

export async function getNftsStatuses(network: Network): Promise<ResponseWithChainMeta<INftStatus[]>> {
    const client = new UNSClient();
    client.init({ network });

    const nftStatus = await client.nft.status();
    const nftNames: string[] | undefined = nftStatus?.data;

    const result: ResponseWithChainMeta<INftStatus[]> = {
        data: [],
        chainmeta: nftStatus.chainmeta,
    };

    if (nftNames) {
        result.data = await Promise.all(
            nftNames.map(async nftName => {
                switch (nftName) {
                    case "unik":
                        const statusResponse = await client.unik.status();
                        const status: INftStatus = statusResponse.data as INftStatus;
                        if (!status) {
                            throw new Error(`${nftName} status not found`);
                        }
                        return status;
                    default:
                        console.debug(`status getter not implemented for ${nftName} token`);
                        return {
                            nftName,
                        };
                }
            }),
        );
    }
    return result;
}

import { Interfaces, Transactions } from "@uns/ark-crypto";
import {
    CertifiedNftMintTransaction,
    INftMintDemand,
    INftMintDemandCertification,
    UNSCertifiedNftMintBuilder,
} from "@uns/crypto";
import { Response, UNSClient } from "../clients";
import { Network } from "../config";
import { codes } from "../types/errors";
import { SdkResult } from "../types/results";
import { Transactions as NftTransactions } from "@uns/core-nft-crypto";
import { Builders } from "@uns/core-nft-crypto";

export const createCertifiedNnfMintTransaction = async (
    network: Network,
    tokenId: string,
    tokenType: string,
    fees: number,
    nonce: string,
    passphrase: string,
    secondPassPhrase: string,
    nftName: string,
    certification: boolean = true,
): Promise<SdkResult<Interfaces.ITransactionData>> => {
    const client = new UNSClient();
    client.init({ network });

    let builder;

    if (certification) {
        Transactions.TransactionRegistry.registerTransactionType(CertifiedNftMintTransaction);

        builder = new UNSCertifiedNftMintBuilder(nftName, tokenId).properties({ type: tokenType });

        const currentAsset: INftMintDemand = builder.getCurrentAsset() as INftMintDemand;

        const reponse: Response<INftMintDemandCertification> = await client.mintDemandCertification.create(
            currentAsset,
        );

        if (reponse.error) {
            return reponse.error;
        }

        if (!reponse.data) {
            return codes.MINT_ERROR_CREATION_DATA_NULL;
        }

        builder.certification(reponse.data);
    } else {
        Transactions.TransactionRegistry.registerTransactionType(NftTransactions.NftMintTransaction);
        builder = new Builders.NftMintBuilder(nftName, tokenId).properties({ type: tokenType });
    }

    builder
        .fee(`${fees}`)
        .nonce(nonce)
        .sign(passphrase);

    if (secondPassPhrase) {
        builder.secondSign(secondPassPhrase);
    }

    return builder.getStruct();
};

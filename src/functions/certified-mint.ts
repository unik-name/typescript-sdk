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

export const createCertifiedNnfMintTransaction = async (
    network: Network,
    tokenId: string,
    tokenType: string,
    fees: number,
    nonce: string,
    passphrase: string,
    secondPassPhrase: string,
    nftName: string,
): Promise<SdkResult<Interfaces.ITransactionData>> => {
    Transactions.TransactionRegistry.registerTransactionType(CertifiedNftMintTransaction);

    const client = new UNSClient();
    client.init({ network });

    const builder = new UNSCertifiedNftMintBuilder(nftName, tokenId).properties({ type: tokenType });

    const currentAsset: INftMintDemand = builder.getCurrentAsset() as INftMintDemand;

    const reponse: Response<INftMintDemandCertification> = await client.mintDemandCertification.create(currentAsset);

    if (reponse.error) {
        return reponse.error;
    }

    if (!reponse.data) {
        return codes.MINT_ERROR_CREATION_DATA_NULL;
    }

    builder
        .certification(reponse.data)
        .fee(`${fees}`)
        .nonce(nonce)
        .sign(passphrase);

    if (secondPassPhrase) {
        builder.secondSign(secondPassPhrase);
    }

    return builder.getStruct();
};

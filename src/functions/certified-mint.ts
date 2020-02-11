import { Interfaces, Transactions, Identities } from "@uns/ark-crypto";
import {
    CertifiedNftMintTransaction,
    INftMintDemand,
    INftMintDemandCertification,
    UNSCertifiedNftMintBuilder,
    INftMintDemandPayload,
    NftMintDemandSigner,
    ICertifiedDemand,
} from "@uns/crypto";
import { Response, UNSClient } from "../clients";
import { Network } from "../config";
import { codes } from "../types/errors";
import { SdkResult } from "../types/results";
import { Transactions as NftTransactions, Interfaces as NftInterfaces } from "@uns/core-nft-crypto";
import { Builders } from "@uns/core-nft-crypto";
import { getCurrentIAT } from "../utils";

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
        const currentAsset: NftInterfaces.ITransactionNftAssetData = builder.getCurrentAsset();

        const demandPayload: INftMintDemandPayload = {
            iss: tokenId,
            sub: tokenId,
            iat: getCurrentIAT(),
            cryptoAccountAddress: Identities.Address.fromPassphrase(passphrase),
        };

        const mintDemandSignature: string = new NftMintDemandSigner({
            ...currentAsset,
            // here, demand.signature will be ignored by the NftMintDemandSigner
            // in an ideal world, the NftMintDemandSigner would require type exclusing this property
            // So, don't worry about the emppty signature here.
            demand: { payload: demandPayload, signature: "" },
        }).sign(passphrase);

        const demand: ICertifiedDemand<INftMintDemandPayload> = {
            payload: demandPayload,
            signature: mintDemandSignature,
        };

        const mintDemand: INftMintDemand = {
            ...currentAsset,
            demand,
        };

        const reponse: Response<INftMintDemandCertification> = await client.mintDemandCertification.create(mintDemand);

        if (reponse.error) {
            return reponse.error;
        }

        if (!reponse.data) {
            return codes.MINT_ERROR_CREATION_DATA_NULL;
        }

        builder.demand(demand).certification(reponse.data);
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

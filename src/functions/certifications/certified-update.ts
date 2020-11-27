import { Interfaces, Identities } from "@uns/ark-crypto";
import { Interfaces as NftInterfaces } from "@uns/core-nft-crypto";
import { CertifiedNftUpdateTransaction, UNSCertifiedNftUpdateBuilder, ICertifiedDemand } from "@uns/crypto";
import {
    codes,
    NftFactoryServicesList,
    UNSClient,
    Response,
    INftUpdateDemandPayload,
    INftUpdateDemand,
    INftUpdateDemandCertification,
    NftUpdateDemandSigner,
} from "../../clients";
import { registerTransaction } from "../transactions/register";
import { SdkResult } from "./types";
import { getCurrentIAT } from "./utils";

export const createCertifiedNftUpdateTransaction = async (
    client: UNSClient,
    tokenId: string,
    properties: { [_: string]: string },
    fees: number,
    nonce: string,
    passphrase: string,
    secondPassPhrase?: string,
    nftName: string = "unik",
    serviceId?: NftFactoryServicesList,
    unikname?: string,
): Promise<SdkResult<Interfaces.ITransactionData>> => {
    registerTransaction(CertifiedNftUpdateTransaction);

    const builder = new UNSCertifiedNftUpdateBuilder(nftName, tokenId).properties(properties);
    const currentAsset: NftInterfaces.ITransactionNftAssetData = builder.getCurrentAsset();

    const demandPayload: INftUpdateDemandPayload = {
        iss: tokenId,
        sub: tokenId,
        iat: getCurrentIAT(),
        cryptoAccountAddress: Identities.Address.fromPassphrase(passphrase),
    };

    const updateDemandSignature: string = new NftUpdateDemandSigner({
        ...currentAsset,
        // here, demand.signature will be ignored by the NftMintDemandSigner
        // in an ideal world, the NftMintDemandSigner would require type exclusing this property
        // So, don't worry about the empty signature here.
        demand: { payload: demandPayload, signature: "" },
    }).sign(passphrase);

    const demand: ICertifiedDemand<INftUpdateDemandPayload> = {
        payload: demandPayload,
        signature: updateDemandSignature,
    };

    const updateDemand: INftUpdateDemand = {
        ...currentAsset,
        demand,
    };

    const reponse: Response<INftUpdateDemandCertification> = await client.updateDemandCertification.create({
        demand: updateDemand,
        serviceId,
        unikname,
    });

    if (reponse.error) {
        return reponse.error;
    }

    if (!reponse.data) {
        return codes.UPDATE_ERROR_CREATION_DATA_NULL;
    }

    const issuerAddress: string | undefined = (await client.unik.get(reponse.data.payload.iss)).data?.ownerId;

    if (!issuerAddress) {
        return codes.CERTIFICATION_ISSUER_OWNER_ERROR;
    }

    builder
        .demand(demand)
        .certification(reponse.data, issuerAddress)
        .fee(`${fees}`)
        .nonce(nonce)
        .sign(passphrase);

    if (secondPassPhrase) {
        builder.secondSign(secondPassPhrase);
    }

    return builder.getStruct();
};

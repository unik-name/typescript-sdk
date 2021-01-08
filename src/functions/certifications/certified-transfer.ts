import { Interfaces } from "@uns/ark-crypto";
import { Response } from "../../clients";
import { Interfaces as NftInterfaces } from "@uns/core-nft-crypto";
import {
    codes,
    INftDemand,
    INftDemandPayload,
    INftDemandCertification,
    NftDemandSigner,
    NftFactoryServicesList,
    unikProperty,
} from "../../clients/repositories";
import { DIDTypes } from "../did";
import { SdkResult, UnikTransferCertifiedTransactionBuildOptions } from "./types";
import { registerTransaction } from "../transactions/register";
import { getCurrentIAT } from "./utils";
import { CertifiedNftTransferTransaction, UNSCertifiedNftTransferBuilder, ICertifiedDemand } from "@uns/crypto";
import { transferDemandCertificationCreate } from "../../clients/repositories/transfer-demand-certification";

export const createCertifiedNftTransferTransaction = async (
    options: UnikTransferCertifiedTransactionBuildOptions,
): Promise<SdkResult<Interfaces.ITransactionData>> => {
    const { httpClient, unikId, recipientAddress, fees, nonce, passphrase, secondPassPhrase, properties } = options;

    const didType = await unikProperty(httpClient)(unikId, "type").then(res =>
        res.data ? parseInt(res.data) : undefined,
    );

    registerTransaction(CertifiedNftTransferTransaction);

    const builder = new UNSCertifiedNftTransferBuilder("unik", unikId).properties(properties || {});

    const currentAsset: NftInterfaces.ITransactionNftAssetData = builder.getCurrentAsset();

    const demandPayload: INftDemandPayload = {
        iss: unikId,
        sub: unikId,
        iat: getCurrentIAT(),
        cryptoAccountAddress: recipientAddress,
    };

    const demandSignature: string = new NftDemandSigner({
        ...currentAsset,
        // here, demand.signature will be ignored by the NftMintDemandSigner
        // in an ideal world, the NftMintDemandSigner would require type exclusing this property
        // So, don't worry about the empty signature here.
        demand: { payload: demandPayload, signature: "" },
    }).sign(passphrase);

    const demand: ICertifiedDemand<INftDemandPayload> = {
        payload: demandPayload,
        signature: demandSignature,
    };

    const transferAsset: INftDemand = {
        ...currentAsset,
        demand,
    };

    let serviceId;
    switch (didType) {
        case DIDTypes.INDIVIDUAL:
            serviceId = NftFactoryServicesList.NFT_FACTORY_TRANSFER_INDIVIDUAL;
            break;
        case DIDTypes.ORGANIZATION:
            serviceId = NftFactoryServicesList.NFT_FACTORY_TRANSFER_ORGANIZATION;
            break;
        case DIDTypes.NETWORK:
            serviceId = NftFactoryServicesList.NFT_FACTORY_TRANSFER_NETWORK;
            break;
        default:
            return codes.INVALID_DID_TYPE;
    }

    const reponse: Response<INftDemandCertification> = await transferDemandCertificationCreate(httpClient)({
        demand: transferAsset,
        serviceId,
    });

    if (reponse.error) {
        return reponse.error;
    }

    if (!reponse.data) {
        return codes.CERTIFICATION_CREATION_ERROR;
    }

    builder
        .demand(demand)
        .certification(reponse.data)
        .recipientId(recipientAddress)
        .fee(`${fees}`)
        .nonce(nonce)
        .sign(passphrase);

    if (secondPassPhrase) {
        builder.secondSign(secondPassPhrase);
    }

    return builder.getStruct();
};

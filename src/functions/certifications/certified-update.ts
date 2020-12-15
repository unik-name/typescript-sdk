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
    updateDemandCertificationCreate,
    unikGet,
} from "../../clients";
import { registerTransaction } from "../transactions/register";
import { SdkResult, UnikUpdateCertifiedTransactionBuildOptions } from "./types";
import { getCurrentIAT } from "./utils";

export const buildUnikUpdateCertifiedTransaction = async (
    options: UnikUpdateCertifiedTransactionBuildOptions,
): Promise<SdkResult<Interfaces.ITransactionData>> => {
    const {
        unikId,
        properties,
        passphrase,
        secondPassPhrase,
        httpClient,
        serviceId,
        unikname,
        fees,
        nonce,
        lifecycleStatusProof,
    } = options;

    registerTransaction(CertifiedNftUpdateTransaction);

    // TODO update type in @uns/core-nft-crypto builder to remove this line !!!!
    const props: { [_: string]: string } = properties as { [_: string]: string };
    const builder = new UNSCertifiedNftUpdateBuilder("unik", unikId).properties(props);
    const currentAsset: NftInterfaces.ITransactionNftAssetData = builder.getCurrentAsset();

    const demandPayload: INftUpdateDemandPayload = {
        iss: unikId,
        sub: unikId,
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

    const reponse: Response<INftUpdateDemandCertification> = await updateDemandCertificationCreate(httpClient)({
        demand: updateDemand,
        serviceId,
        unikname,
        jwtProof: lifecycleStatusProof,
    });

    if (reponse.error) {
        return reponse.error;
    }

    if (!reponse.data) {
        return codes.UPDATE_ERROR_CREATION_DATA_NULL;
    }

    const issuerAddress: string | undefined = (await unikGet(httpClient)(reponse.data.payload.iss)).data?.ownerId;

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

// TODO DEPRECATED
export const createCertifiedNftUpdateTransaction = async (
    client: UNSClient,
    tokenId: string,
    properties: { [_: string]: string },
    fees: number,
    nonce: string,
    passphrase: string,
    secondPassPhrase?: string,
    _: string = "unik", // old property `nftName`, not used.
    serviceId?: NftFactoryServicesList,
    unikname?: string,
): Promise<SdkResult<Interfaces.ITransactionData>> =>
    buildUnikUpdateCertifiedTransaction({
        unikId: tokenId,
        properties,
        passphrase,
        fees,
        nonce,
        httpClient: client.http,
        secondPassPhrase,
        serviceId,
        unikname,
    });

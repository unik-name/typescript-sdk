import { Interfaces, Identities } from "@uns/ark-crypto";
import { Response, UNSClient } from "../../clients";
import { Transactions as NftTransactions, Interfaces as NftInterfaces, Builders } from "@uns/core-nft-crypto";
import {
    codes,
    INftMintDemand,
    INftMintDemandCertification,
    INftMintDemandPayload,
    NetworkUnitService,
    NftMintDemandSigner,
    UnikPattern,
    UNSServiceType,
} from "../../clients/repositories";
import { parse, DidParserError, DidParserResult, DIDTypes, DIDHelpers } from "../did";
import { SdkResult, UnikMintCertifiedTransactionBuildOptions } from "./types";
import { registerTransaction } from "../transactions/register";
import { getCurrentIAT } from "./utils";
import { BADGE_XP_LEVEL_KEY, LifeCycleGrades, LIFE_CYCLE_PROPERTY_KEY, XPLevelBadgeGrades } from "../unik/constants";
import { CertifiedNftMintTransaction, UNSCertifiedNftMintBuilder, ICertifiedDemand } from "@uns/crypto";
import { decodeJWT } from "did-jwt";

export const buildCertifiedNftMintTransaction = async (
    options: UnikMintCertifiedTransactionBuildOptions,
): Promise<SdkResult<Interfaces.ITransactionData>> => {
    const {
        tokenId,
        passphrase,
        secondPassphrase,
        client,
        unikname,
        fees,
        nonce,
        unikVoucher,
        orderId,
        certification,
    } = options;

    let builder;
    let zeroFee = false;
    const unikParseResult: DidParserResult | DidParserError = await parse(unikname, client);

    if (unikParseResult instanceof DidParserError) {
        return codes.DID_PARSER_ERROR;
    }

    const didType: DIDTypes = DIDHelpers.fromLabel(unikParseResult.type);

    if (certification !== false) {
        registerTransaction(CertifiedNftMintTransaction);

        let properties;

        try {
            properties = computeProperties(didType, unikVoucher);
        } catch (e) {
            console.debug(
                `[${codes.UNIK_VOUCHER_FORMAT_ERROR.code}] ${codes.UNIK_VOUCHER_FORMAT_ERROR.message} (${e.message})`,
            );
            return codes.UNIK_VOUCHER_FORMAT_ERROR;
        }

        builder = new UNSCertifiedNftMintBuilder(unikParseResult.tokenName, tokenId).properties(properties);

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
            // So, don't worry about the empty signature here.
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

        const patternResponse: Response<UnikPattern> = await client.unikPattern.compute({
            explicitValue: unikParseResult.explicitValue,
            type: DIDTypes[unikParseResult.type],
        });

        if (patternResponse.error) {
            return patternResponse.error;
        }

        if (patternResponse.data?.lengthGroup === undefined || patternResponse.data?.script === undefined) {
            return codes.UNIK_PATTERN_MALFORMED_ERROR;
        }

        const mintServiceResponse: Response<NetworkUnitService> = await client.networkUnitServices.search({
            transaction: UNSServiceType.MINT,
            lengthGroup: patternResponse.data?.lengthGroup,
            didType: patternResponse.data?.didType,
            script: patternResponse.data?.script,
        });

        if (mintServiceResponse.error) {
            return mintServiceResponse.error;
        }

        const reponse: Response<INftMintDemandCertification> = await client.mintDemandCertification.create({
            demand: mintDemand,
            serviceId: mintServiceResponse.data?.id,
            unikname,
            unikVoucher,
            orderId,
        });

        if (reponse.error) {
            return reponse.error;
        }

        if (!reponse.data) {
            return codes.MINT_ERROR_CREATION_DATA_NULL;
        }

        const issuerAddress: string | undefined = (await client.unik.get(reponse.data.payload.iss)).data?.ownerId;

        if (!issuerAddress) {
            return codes.CERTIFICATION_ISSUER_OWNER_ERROR;
        }

        builder.demand(demand).certification(reponse.data, issuerAddress);

        // token eco v2: override individual mint fee to 0
        if (unikVoucher && didType === DIDTypes.INDIVIDUAL) {
            zeroFee = true;
        }
    } else {
        registerTransaction(NftTransactions.NftMintTransaction);
        builder = new Builders.NftMintBuilder(unikParseResult.tokenName, tokenId).properties({
            type: `${didType}`,
        });
    }

    builder
        .fee(zeroFee ? "0" : `${fees}`)
        .nonce(nonce)
        .sign(passphrase);

    if (secondPassphrase) {
        builder.secondSign(secondPassphrase);
    }

    return builder.getStruct();
};

function computeProperties(didType: DIDTypes, unikVoucher?: string): NftInterfaces.INftProperties {
    const properties: NftInterfaces.INftProperties = {
        type: `${didType}`,
    };

    properties[LIFE_CYCLE_PROPERTY_KEY] = LifeCycleGrades.MINTED.toString();
    if (didType === DIDTypes.INDIVIDUAL) {
        properties[BADGE_XP_LEVEL_KEY] = XPLevelBadgeGrades.NEWCOMER.toString();
    }
    if (unikVoucher) {
        const decodeUnikVoucher: any = decodeJWT(unikVoucher);
        properties.UnikVoucherId = decodeUnikVoucher.payload.jti; // UnikVoucherId has to be set, it will be compared to the unikVoucher.payload.id in certification service after verification
        if (didType !== DIDTypes.INDIVIDUAL) {
            properties[LIFE_CYCLE_PROPERTY_KEY] = LifeCycleGrades.LIVE.toString();
        }
    }
    return properties;
}

// TODO DEPRECATED
export const createCertifiedNftMintTransaction = async (
    client: UNSClient,
    tokenId: string,
    unikname: string,
    fees: number,
    nonce: string,
    passphrase: string,
    secondPassPhrase?: string,
    unikVoucher?: string,
    certification: boolean = true,
    orderId?: string,
): Promise<SdkResult<Interfaces.ITransactionData>> =>
    buildCertifiedNftMintTransaction({
        tokenId,
        passphrase,
        fees,
        nonce,
        client,
        secondPassphrase: secondPassPhrase,
        unikname,
        unikVoucher,
        orderId,
        certification,
    });

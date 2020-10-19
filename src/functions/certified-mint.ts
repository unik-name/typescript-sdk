import { Interfaces, Identities, Managers } from "@uns/ark-crypto";
import {
    CertifiedNftMintTransaction,
    INftMintDemand,
    INftMintDemandCertification,
    UNSCertifiedNftMintBuilder,
    ICertifiedDemand,
    DIDHelpers,
    DIDTypes,
    INftMintDemandPayload,
    NftMintDemandSigner,
    LIFE_CYCLE_PROPERTY_KEY,
    LifeCycleGrades,
} from "@uns/crypto";
import { Response, UNSClient } from "../clients";
import { codes } from "../types/errors";
import { SdkResult } from "../types/results";
import { Transactions as NftTransactions, Interfaces as NftInterfaces, Builders } from "@uns/core-nft-crypto";
import { getCurrentIAT } from "../utils";
import { registerTransaction } from "../utils/registerTransaction";
import { BADGE_XP_LEVEL_KEY, XPLevelBadgeGrades, UNSServiceType } from "../types";
import { NetworkUnitService, UnikPattern } from "../clients/repositories";
import { parse, DidParserError, DidParserResult } from "./did";
import { decodeJWT } from "did-jwt";

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
): Promise<SdkResult<Interfaces.ITransactionData>> => {
    let builder;

    const unikParseResult: DidParserResult | DidParserError = await parse(unikname, client);

    if (unikParseResult instanceof DidParserError) {
        return codes.DID_PARSER_ERROR;
    }

    const didType: DIDTypes = DIDHelpers.fromLabel(unikParseResult.type);

    if (certification) {
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
        if (unikVoucher && didType === DIDTypes.INDIVIDUAL && Managers.configManager.getMilestone()?.unsTokenEcoV2) {
            fees = 0;
        }
    } else {
        registerTransaction(NftTransactions.NftMintTransaction);
        builder = new Builders.NftMintBuilder(unikParseResult.tokenName, tokenId).properties({
            type: `${didType}`,
        });
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

function computeProperties(didType: DIDTypes, unikVoucher?: string): NftInterfaces.INftProperties {
    const properties: NftInterfaces.INftProperties = {
        type: `${didType}`,
    };

    properties[LIFE_CYCLE_PROPERTY_KEY] = LifeCycleGrades.MINTED.toString();

    if (unikVoucher) {
        const decodeUnikVoucher: any = decodeJWT(unikVoucher);
        properties.UnikVoucherId = decodeUnikVoucher.payload.jti; // UnikVoucherId has to be set, it will be compared to the unikVoucher.payload.id in certification service after verification

        // token evo v1
        // every mint with voucher is LIVE
        properties[LIFE_CYCLE_PROPERTY_KEY] = LifeCycleGrades.LIVE.toString();
        // individual mint have BEGINNER badge
        if (didType === DIDTypes.INDIVIDUAL) {
            properties[BADGE_XP_LEVEL_KEY] = XPLevelBadgeGrades.BEGINNER.toString();
        }
    }

    // token eco V2
    if (Managers.configManager.getMilestone().unsTokenEcoV2) {
        // individual mint have GUEST badge and MINTED status
        if (didType === DIDTypes.INDIVIDUAL) {
            properties[BADGE_XP_LEVEL_KEY] = XPLevelBadgeGrades.GUEST.toString();
            properties[LIFE_CYCLE_PROPERTY_KEY] = LifeCycleGrades.MINTED.toString();
        }
    }

    return properties;
}

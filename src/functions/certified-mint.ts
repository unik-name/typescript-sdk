import { Interfaces, Transactions, Identities } from "@uns/ark-crypto";
import {
    CertifiedNftMintTransaction,
    INftMintDemand,
    INftMintDemandCertification,
    UNSCertifiedNftMintBuilder,
    INftMintDemandPayload,
    NftMintDemandSigner,
    ICertifiedDemand,
    DIDHelpers,
    DIDTypes,
} from "@uns/crypto";
import { Response, UNSClient } from "../clients";
import { codes } from "../types/errors";
import { SdkResult } from "../types/results";
import { Transactions as NftTransactions, Interfaces as NftInterfaces } from "@uns/core-nft-crypto";
import { Builders } from "@uns/core-nft-crypto";
import { getCurrentIAT } from "../utils";
import { UNSServiceType } from "../types";
import { NetworkUnitService, UnikPattern } from "../clients/repositories";
import { parse, DidParserError, DidParserResult } from "./did";

export const createCertifiedNftMintTransaction = async (
    client: UNSClient,
    tokenId: string,
    unikname: string,
    fees: number,
    nonce: string,
    passphrase: string,
    secondPassPhrase: string,
    certification: boolean = true,
): Promise<SdkResult<Interfaces.ITransactionData>> => {
    let builder;

    const unikParseResult: DidParserResult | DidParserError = await parse(unikname, client);

    if (unikParseResult instanceof DidParserError) {
        return codes.DID_PARSER_ERROR;
    }

    const tokenTypeAsNumber: number = DIDHelpers.fromLabel(unikParseResult.type);

    if (certification) {
        Transactions.TransactionRegistry.registerTransactionType(CertifiedNftMintTransaction);

        builder = new UNSCertifiedNftMintBuilder(unikParseResult.tokenName, tokenId).properties({
            type: `${tokenTypeAsNumber}`,
        });
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
    } else {
        Transactions.TransactionRegistry.registerTransactionType(NftTransactions.NftMintTransaction);
        builder = new Builders.NftMintBuilder(unikParseResult.tokenName, tokenId).properties({
            type: `${tokenTypeAsNumber}`,
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

import { HTTPClient, FunctionalError, NftFactoryServicesList, UNSClient } from "../../clients";
import { Interfaces } from "@uns/core-nft-crypto";

export type SdkResult<T> = T | FunctionalError;

export function isError<T>(result: SdkResult<T>): result is FunctionalError {
    return (result as FunctionalError).code !== undefined && (result as FunctionalError).message !== undefined;
}

export type UnikUpdateCertifiedTransactionBuildOptions = {
    unikId: string;
    properties: Interfaces.INftProperties;
    passphrase: string;
    fees: number;
    nonce: string;
    httpClient: HTTPClient;
    secondPassphrase?: string;
    serviceId?: NftFactoryServicesList;
    unikname?: string;
    lifecycleStatusProof?: string;
};

export type UnikMintCertifiedTransactionBuildOptions = {
    tokenId: string;
    passphrase: string;
    fees: number;
    nonce: string;
    client: UNSClient;
    secondPassphrase?: string;
    unikname: string;
    unikVoucher?: string;
    orderId?: string;
    certification?: boolean;
};

export type UnikTransferCertifiedTransactionBuildOptions = {
    httpClient: HTTPClient;
    unikId: string;
    recipientAddress: string;
    fees: number;
    nonce: string;
    passphrase: string;
    secondPassPhrase?: string;
    properties?: Interfaces.INftProperties;
};

import { HTTPClient, FunctionalError, NftFactoryServicesList, UNSClient } from "../../clients";

export type SdkResult<T> = T | FunctionalError;

export function isError<T>(result: SdkResult<T>): result is FunctionalError {
    return (result as FunctionalError).code !== undefined && (result as FunctionalError).message !== undefined;
}

export type UnikPropertiesUpdate = {
    [_: string]: string | null;
};

export type UnikUpdateCertifiedTransactionBuildOptions = {
    unikId: string;
    properties: UnikPropertiesUpdate;
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

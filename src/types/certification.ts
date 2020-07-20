import { INftDemand } from "@uns/crypto";

export enum NftFactoryServicesList {
    NFT_FACTORY_MINT_INDIVIDUAL_DIGITS_TINY = 1,
    NFT_FACTORY_MINT_INDIVIDUAL_DIGITS_STD = 2,
    NFT_FACTORY_MINT_INDIVIDUAL_DIGITS_LONG = 3,
    NFT_FACTORY_MINT_INDIVIDUAL_LATIN_SAFE_TYPO_1 = 4,
    NFT_FACTORY_MINT_INDIVIDUAL_LATIN_SAFE_TYPO_2 = 5,
    NFT_FACTORY_MINT_INDIVIDUAL_LATIN_SAFE_TYPO_3 = 6,
    NFT_FACTORY_MINT_INDIVIDUAL_LATIN_SAFE_TYPO_TINY = 7,
    NFT_FACTORY_MINT_INDIVIDUAL_LATIN_SAFE_TYPO_SHORT = 8,
    NFT_FACTORY_MINT_INDIVIDUAL_LATIN_SAFE_TYPO_NORMAL = 9,
    NFT_FACTORY_MINT_INDIVIDUAL_LATIN_SAFE_TYPO_LONG = 10,
    NFT_FACTORY_MINT_ORGANIZATION_DIGITS = 11,
    NFT_FACTORY_MINT_ORGANIZATION_LATIN = 12,
    NFT_FACTORY_MINT_NETWORK = 13,
    NFT_FACTORY_COMPUTE_LIFE_CYCLE = 14,
    NFT_FACTORY_RESET = 15,
    NFT_FACTORY_NEW_LIFE = 16,
    NFT_FACTORY_EXTENDS_SHELFLIFE_INDIVIDUAL = 17,
    NFT_FACTORY_EXTENDS_SHELFLIFE_ORGANIZATION = 18,
    NFT_FACTORY_EXTENDS_SHELFLIFE_NETWORK = 19,
    NFT_FACTORY_TRANSFER_INDIVIDUAL = 20,
    NFT_FACTORY_TRANSFER_ORGANIZATION = 21,
    NFT_FACTORY_TRANSFER_NETWORK = 22,
    NFT_FACTORY_EVERLASTING_BAGDE_INDIVIDUAL = 23,
    NFT_FACTORY_EVERLASTING_BAGDE_ORGANIZATION = 24,
    NFT_FACTORY_EVERLASTING_BAGDE_NETWORK = 25,
    NFT_FACTORY_URL_VERIFICATION = 26,
    NFT_FACTORY_BADGE_PIONEER = 27,
}

export interface CertificationRequestBody<T extends INftDemand> {
    demand: T;
    unikname?: string; // DID
    serviceId?: NftFactoryServicesList;
    unikVoucher?: string;
}

export enum UNSServiceType {
    MINT = 0,
    UPDATE = 1,
    TRANSFER = 2,
}

export enum DIDScript {
    DIGIT = 1,
    LATIN = 2,
}

export enum UNSLengthGroup {
    DIGITS_TINY,
    DIGITS_STD,
    DIGITS_LONG,
    LATIN_1,
    LATIN_2,
    LATIN_3,
    LATIN_TINY,
    LATIN_SHORT,
    LATIN_NORMAL,
    LATIN_LONG,
}

export enum DIDLikeness {
    NONE = 0,
    SINGLE_CHAR = 1,
    CRYPTO_ADDR = 2,
    TLD = 4,
}

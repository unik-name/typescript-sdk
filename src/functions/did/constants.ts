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

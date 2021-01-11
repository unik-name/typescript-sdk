export type FingerprintComputingInformations = {
    isEndingWithTLD: boolean;
    isEndingWithTLDWithDot: boolean;
};

export type FingerprintResult = {
    fingerprint: string;
    computingInformations?: FingerprintComputingInformations;
};

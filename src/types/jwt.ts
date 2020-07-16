import { NftFactoryServicesList } from "./certification";

export type JWTPayload = any;

export type VoucherJWTPayload = JWTPayload & {
    authorizations: {
        services: NftFactoryServicesList[];
    };
    couponHash?: string;
    paymentProof?: string;
};

export type PropertyVerifierType = "url";

export type PropertyVerifierJWTPayload = JWTPayload & {
    type: PropertyVerifierType;
    value: string;
};

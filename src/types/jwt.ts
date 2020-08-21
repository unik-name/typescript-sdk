import { NftFactoryServicesList } from "./certification";
import { DIDDocument } from "did-resolver";

export type JWTPayload = any;
export type JwtParams = {
    sub: string;
    iss: string;
    issSecret: string;
    aud: string;
    exp: number;
};

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

export type VerifiedJWT = {
    payload: PropertyVerifierJWTPayload | VoucherJWTPayload;
    doc: DIDDocument;
    issuer: string;
    signer: object;
    jwt: string;
};

import { DIDDocument } from "did-resolver";
import { ec } from "elliptic";
import { SimpleSigner, createJWT, verifyJWT, Signer, decodeJWT } from "did-jwt";

import nanoid = require("nanoid");
import { Keys } from "@uns/ark-crypto/dist/identities/keys";
import {
    NftFactoryServicesList,
    VoucherJWTPayload,
    PropertyVerifierJWTPayload,
    PropertyVerifierType,
    JWTPayload,
    JwtParams,
} from "../types";
import { UNSClient } from "../clients";

export const UNIK_DID_PREFIX = "did:unik:unid:";

const publicKeyToDIDDocument = (publicKeyHex: string): DIDDocument => ({
    "@context": "https://w3id.org/did/v1",
    id: "", // can be empty because not used for now
    publicKey: [
        {
            id: "", // can be empty because not used for now
            type: "EcdsaPublicKeySecp256k1",
            publicKeyHex,
            owner: "", // can be empty because not used for now
        },
    ],
});

export const parseUnikDID = (did: string): string => {
    const matches = did.match(new RegExp(`${UNIK_DID_PREFIX}([0-9a-fA-F]{64})`));
    if (!matches) {
        throw new Error(`not a did format. Expecting '${UNIK_DID_PREFIX}{unikId}'`);
    }
    return matches[1];
};

export function computeUnikDid(unikId: string) {
    return `${UNIK_DID_PREFIX}${unikId}`;
}

export function getUnikVoucherId(unikVoucher: string): string {
    return (decodeJWT(unikVoucher).payload as any).jti;
}

export function getUnikVoucherCouponHash(unikVoucher: string): string | undefined {
    return (decodeJWT(unikVoucher).payload as any).couponHash;
}

export async function createUnikVoucher(
    tokenId: string,
    matchingServices: NftFactoryServicesList[],
    issuerId: string,
    issuerSecret: string,
    expirationDuration: number,
    couponHash?: string,
    paymentProof?: string,
): Promise<string> {
    const payload: VoucherJWTPayload = {
        authorizations: {
            services: matchingServices,
        },
        paymentProof,
        couponHash,
    };
    // same UNID for aud and iss
    return createUnsJWT(
        { sub: tokenId, iss: issuerId, issSecret: issuerSecret, aud: issuerId, exp: expirationDuration },
        payload,
    );
}

export async function createPropertyVerifierToken(
    tokenId: string,
    audUNID: string,
    issuerSecret: string,
    expirationDuration: number,
    type: PropertyVerifierType,
    value: string,
): Promise<string> {
    const payload: PropertyVerifierJWTPayload = {
        type,
        value,
    };
    // same UNID for sub and iss
    return createUnsJWT(
        { sub: tokenId, iss: tokenId, issSecret: issuerSecret, aud: audUNID, exp: expirationDuration },
        payload,
    );
}

async function createUnsJWT(jwtParams: JwtParams, payload: JWTPayload): Promise<string> {
    const curve = new ec("secp256k1");
    const privateKey: string = Keys.fromPassphrase(jwtParams.issSecret).privateKey;
    const keyPair: ec.KeyPair = curve.keyFromPrivate(privateKey);
    const signer: Signer = SimpleSigner(keyPair.getPrivate("hex"));

    const JWTPayload: any = {
        jti: nanoid(),
        aud: computeUnikDid(jwtParams.aud),
        sub: computeUnikDid(jwtParams.sub),
        ...payload,
    };

    return createJWT(JWTPayload, {
        alg: "ES256K",
        issuer: computeUnikDid(jwtParams.iss),
        expiresIn: jwtParams.exp,
        signer,
    });
}

export class JWTVerifier {
    private resolver: any;

    constructor(protected readonly unsClient: UNSClient) {
        this.resolver = {
            resolve: this.getResolveFunction(unsClient),
        };
    }

    public async verifyUnsJWT(rawJwt: string, audUNID: string): Promise<any> {
        const audDID: string = computeUnikDid(audUNID);

        const options: any = {
            resolver: this.resolver,
            audience: audDID, // Required audience - must be `did:unik:unid:{unikid}` else it throws
            callbackUrl: audDID, // used by did-jwt if not set it throws
        };

        return verifyJWT(rawJwt, options);
    }

    private getResolveFunction(unsClient: UNSClient) {
        return async (did: string): Promise<DIDDocument> => {
            const unikid = parseUnikDID(did);

            const unikResponse = await unsClient.unik.get(unikid);

            if (unikResponse.error) {
                throw new Error(`Unik not found (${unikResponse.error.code},${unikResponse.error.message})`);
            }

            const ownerAddress = unikResponse.data!.ownerId;

            const walletResponse = await unsClient.wallet.get(ownerAddress);

            if (walletResponse.error) {
                throw new Error(`Wallet not found (${walletResponse.error.code},${walletResponse.error.message})`);
            }

            const ownerPublicKey = walletResponse.data!.publicKey;
            const doc = publicKeyToDIDDocument(ownerPublicKey);

            return doc;
        };
    }
}

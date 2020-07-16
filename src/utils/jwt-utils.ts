import { DIDDocument } from "did-resolver";
import { ec } from "elliptic";
import { SimpleSigner, createJWT, verifyJWT, Signer, decodeJWT } from "did-jwt";

import nanoid = require("nanoid");
import { Identities } from "@uns/ark-crypto";
import {
    NftFactoryServicesList,
    VoucherJWTPayload,
    PropertyVerifierJWTPayload,
    PropertyVerifierType,
    JWTPayload,
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
    return createUnsJWT(tokenId, issuerId, issuerSecret, expirationDuration, payload);
}

export async function createPropertyVerifierToken(
    tokenId: string,
    issuerId: string,
    issuerSecret: string,
    expirationDuration: number,
    type: PropertyVerifierType,
    value: string,
): Promise<string> {
    const payload: PropertyVerifierJWTPayload = {
        type,
        value,
    };
    return createUnsJWT(tokenId, issuerId, issuerSecret, expirationDuration, payload);
}

async function createUnsJWT(
    tokenId: string,
    issuerId: string,
    issuerSecret: string,
    expirationDuration: number,
    payload: JWTPayload,
): Promise<string> {
    const curve = new ec("secp256k1");
    const privateKey: string = Identities.Keys.fromPassphrase(issuerSecret).privateKey;
    const keyPair: ec.KeyPair = curve.keyFromPrivate(privateKey);
    const signer: Signer = SimpleSigner(keyPair.getPrivate("hex"));

    return createJWT(
        {
            jti: nanoid(),
            aud: computeUnikDid(issuerId),
            sub: computeUnikDid(tokenId),
            ...payload,
        },
        {
            alg: "ES256K",
            issuer: computeUnikDid(issuerId),
            expiresIn: expirationDuration,
            signer,
        },
    );
}

export class JWTVerifier {
    private resolver: any;

    constructor(protected readonly unsClient: UNSClient) {
        this.resolver = {
            resolve: this.getResolveFunction(unsClient),
        };
    }

    public async verifyUnsJWT(rawJwt: string, issuerId: string): Promise<any> {
        const didIssuer: string = computeUnikDid(issuerId);

        const options: any = {
            resolver: this.resolver,
            audience: didIssuer, // Required audience - must be `did:unik:unid:{unikid}` else it throws
            callbackUrl: didIssuer, // used by did-jwt if not set it throws
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

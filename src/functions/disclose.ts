import { crypto, HashAlgorithms } from "@uns/crypto";
import { DIDType } from "../types";
import { DiscloseDemand } from "../clients/repositories";

export function buildDiscloseDemand(
    unikid: string,
    explicitValues: string[],
    type: DIDType,
    passphrase: string,
): DiscloseDemand {
    const payload = {
        explicitValue: explicitValues,
        type,
        iss: unikid,
        sub: unikid,
        iat: Date.now(),
    };

    const signature = signPayload(payload, passphrase);

    return { payload, signature };
}

// FROM CRYPTO, TO DELETE AFTER @uns/crypto RELEASE
export const signPayload = (payload: any, passphrase: string): string =>
    crypto.signHash(getHashBuffer(payload), crypto.getKeys(passphrase));

function getHashBuffer(payload: any): Buffer {
    return HashAlgorithms.sha256(Buffer.from(JSON.stringify(sortObject(payload))));
}

export function getSaltedPayloadHash(payload: any, salt: string): string {
    return HashAlgorithms.sha256([Buffer.from(JSON.stringify(sortObject(payload))), Buffer.from(salt)]).toString("hex");
}

/**
 * Verify payload signature.
 */
export function verifyPayload(payload: any, signature: Buffer | string, publicKey: string): boolean {
    return crypto.verifyHash(getHashBuffer(payload), signature, publicKey);
}

function sortObject(object: any) {
    const sortedObj: any = {};
    let keys: string[] = Object.keys(object);
    keys = keys.sort();
    for (const index in keys) {
        if (index) {
            const key = keys[index];
            if (object[key] instanceof Array) {
                object[key].forEach((elt: any, idx: any) => {
                    if (typeof elt === "object") {
                        object[key][idx] = sortObject(elt);
                    }
                });
                sortedObj[key] = object[key].sort();
            } else {
                if (typeof object[key] === "object") {
                    sortedObj[key] = sortObject(object[key]);
                } else {
                    sortedObj[key] = object[key];
                }
            }
        }
    }
    return sortedObj;
}

import { crypto, HashAlgorithms } from "@uns/crypto";
import { DIDType } from "../types";
import { DiscloseDemand } from "..";

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

    const signature = crypto.signHash(
        HashAlgorithms.sha256(Buffer.from(JSON.stringify(payload))),
        crypto.getKeys(passphrase),
    );

    return { payload, signature };
}

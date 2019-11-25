import { DIDTypes, unsCrypto, IDiscloseDemand, IDiscloseDemandPayload } from "@uns/crypto";

export function buildDiscloseDemand(
    unikid: string,
    explicitValues: string[],
    type: DIDTypes,
    passphrase: string,
): IDiscloseDemand {
    const payload: IDiscloseDemandPayload = {
        explicitValue: explicitValues,
        type,
        iss: unikid,
        sub: unikid,
        iat: Date.now(),
    };

    const signature = unsCrypto.signPayload(payload, passphrase);

    return { payload, signature };
}

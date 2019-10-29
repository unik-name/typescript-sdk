import { models, unsCrypto, DiscloseDemand, DiscloseDemandPayload } from "@uns/crypto";

export function buildDiscloseDemand(
    unikid: string,
    explicitValues: string[],
    type: models.DIDTypes,
    passphrase: string,
): DiscloseDemand {
    const payload: DiscloseDemandPayload = {
        explicitValue: explicitValues,
        type,
        iss: unikid,
        sub: unikid,
        iat: Date.now(),
    };

    const signature = unsCrypto.signPayload(payload, passphrase);

    return { payload, signature };
}

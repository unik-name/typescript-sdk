import { DIDTypes, unsCrypto, IDiscloseDemand, IDiscloseDemandPayload } from "@uns/crypto";
import { getCurrentIAT } from "../utils";

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
        iat: getCurrentIAT(),
    };

    const signature = unsCrypto.signPayload(payload, passphrase);

    return { payload, signature };
}

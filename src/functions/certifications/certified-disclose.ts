import { getCurrentIAT } from "./utils";
import { IDiscloseDemand, IDiscloseDemandPayload } from "../../clients/repositories/disclose-demand-certification";
import { DIDTypes } from "../did/types";
import { unsCrypto } from "@uns/crypto";

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

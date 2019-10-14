import { Response } from "../../../src";
import { DiscloseDemandCertification, DiscloseDemand } from "../../../src/clients/repositories";

export const unikid = "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77";

export const discloseDemandCertification: Response<DiscloseDemandCertification> = {
    data: {
        payload: {
            sub: unikid,
            iss: unikid,
            iat: 1670699816,
        },
        signature: "efgh",
    },
};

export const parameters: DiscloseDemand = {
    payload: {
        sub: unikid,
        iss: unikid,
        iat: 1570699816,
        explicitValue: ["explicit1", "explicit2"],
        type: "INDIVIDUAL",
    },
    signature: "abcd",
};

export const safetypoResponse = { data: { core: "b0b" } };
export const fingerprintResponse = {
    data: { fingerprint: "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77" },
};

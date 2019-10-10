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

export const walletId = "D59pZ7fH6vtk23mADnbpqyhfMiJzpdixws";

export const wallet = {
    address: walletId,
    publicKey: "03fdc4f413c90c11ca5a780e4695f88706eb991525c7859a63074b1b0009d31da1",
    username: null,
    secondPublicKey: null,
    balance: 99998487,
    isDelegate: false,
    vote: null,
};

export const chainmeta = {
    height: 151486,
    timestamp: {
        epoch: 1920052,
        unix: 1570634958,
        human: "2019-10-09T15:29:18.000Z",
    },
};

export const walletResponse = {
    data: wallet,
    chainmeta,
};

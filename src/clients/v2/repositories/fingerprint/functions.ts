import { DIDHelpers, DIDTypes } from "../../../../types";
import { FingerprintResult } from "./types";
import { post } from "../service-repository";
import { HTTPClient, Response } from "../..";

export const fingerprintCompute = (client: HTTPClient) => (
    explicitValue: string,
    type: DIDTypes,
    nftName: string = "UNIK",
): Promise<Response<FingerprintResult>> =>
    post<FingerprintResult>(client)("unik-name-fingerprint", undefined, {
        explicitValue,
        type: DIDHelpers.fromCode(type).toLowerCase(),
        nftName,
    });
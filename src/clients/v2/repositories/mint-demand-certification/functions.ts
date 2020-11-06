import { HTTPClient, Response } from "../..";
import { post } from "../network-repository";
import { INftMintDemand, INftMintDemandCertification } from "@uns/crypto";
import { CertificationRequestBody } from "./types";

export const mintDemandCertificationCreate = (client: HTTPClient) => (
    parameters: CertificationRequestBody<INftMintDemand>,
): Promise<Response<INftMintDemandCertification>> =>
    post<Response<INftMintDemandCertification>>(client)("mint-demand-certification", undefined, parameters);

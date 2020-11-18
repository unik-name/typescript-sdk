import { HTTPClient, Response } from "../..";
import { post } from "../service-repository";
import { INftMintDemand, INftMintDemandCertification } from "./types";
import { CertificationRequestBody } from "./types";

export const mintDemandCertificationCreate = (client: HTTPClient) => (
    parameters: CertificationRequestBody<INftMintDemand>,
): Promise<Response<INftMintDemandCertification>> =>
    post<INftMintDemandCertification>(client)("mint-demand-certification", undefined, parameters);

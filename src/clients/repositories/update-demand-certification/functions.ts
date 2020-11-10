import { HTTPClient, Response } from "../..";
import { post } from "../network-repository";
import { INftUpdateDemand, INftUpdateDemandCertification } from "./types";
import { CertificationRequestBody } from "../mint-demand-certification";

export const updateDemandCertificationCreate = (client: HTTPClient) => (
    parameters: CertificationRequestBody<INftUpdateDemand>,
): Promise<Response<INftUpdateDemandCertification>> =>
    post<Response<INftUpdateDemandCertification>>(client)("update-demand-certification", undefined, parameters);

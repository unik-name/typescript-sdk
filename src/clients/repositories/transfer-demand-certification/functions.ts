import { HTTPClient, Response } from "../..";
import { post } from "../service-repository";
import { INftDemand, INftDemandCertification } from "./types";
import { CertificationRequestBody } from "../mint-demand-certification";

export const transferDemandCertificationCreate = (client: HTTPClient) => (
    parameters: CertificationRequestBody<INftDemand>,
): Promise<Response<INftDemandCertification>> =>
    post<INftDemandCertification>(client)("transfer-demand-certification", undefined, parameters);

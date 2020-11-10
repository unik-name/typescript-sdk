import { HTTPClient, Response } from "../..";
import { post } from "../service-repository";
import { IDiscloseDemand, IDiscloseDemandCertification } from "./types";

export const discloseDemandCertificationCreate = (client: HTTPClient) => (
    parameters: IDiscloseDemand,
): Promise<Response<IDiscloseDemandCertification>> =>
    post<IDiscloseDemandCertification>(client)("disclose-demand-certification", undefined, parameters);

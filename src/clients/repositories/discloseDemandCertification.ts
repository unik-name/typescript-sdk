import { Response } from "../response";
import { HTTPError } from "ky-universal";
import { DIDType } from "../..";
import { ServiceRepository } from "./types/ServiceRepository";

export const DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB: string = "disclose-demand-certification";

type JWT = {
    sub: string;
    iss: string;
    iat: number;
};

export type DiscloseDemandPayload = JWT & {
    explicitValue: string[];
    type: DIDType;
};

export type DiscloseDemand = {
    payload: DiscloseDemandPayload;
    signature: string;
};

export type DiscloseDemandCertification = {
    payload: JWT;
    signature: string;
};

export class DiscloseDemandCertificationRepository extends ServiceRepository {
    public async discloseDemandCertification(
        parameters: DiscloseDemand,
    ): Promise<Response<DiscloseDemandCertification>> {
        try {
            const response = await this.POST<Response<DiscloseDemandCertification>>(parameters);
            return response;
        } catch (error) {
            if (error instanceof HTTPError && error.response.status === 400) {
                return { error };
            } else {
                throw error;
            }
        }
    }

    protected sub(): string {
        return DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB;
    }
}

import { Response } from "../response";
import { HTTPError } from "ky-universal";
import { DIDType } from "../..";
import { ServiceRepository } from "./types/ServiceRepository";

export const DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB: string = "disclose-demand-certification";

/**
 * This type represents required properties for certification request payload.
 */
type Certificationable = {
    sub: string;
    iss: string;
    iat: number;
};

export type DiscloseDemandPayload = Certificationable & {
    explicitValue: string[];
    type: DIDType;
};

type CertifiedDemand<T extends Certificationable> = {
    payload: T;
    signature: string;
};

export type DiscloseDemand = CertifiedDemand<DiscloseDemandPayload>;

export type DiscloseDemandCertification = CertifiedDemand<Certificationable>;

export class DiscloseDemandCertificationRepository extends ServiceRepository {
    public async get(parameters: DiscloseDemand): Promise<Response<DiscloseDemandCertification>> {
        return withHttpErrorsHandling(() => this.POST<Response<DiscloseDemandCertification>>(parameters));
    }

    protected sub(): string {
        return DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB;
    }
}

const withHttpErrorsHandling = async (fn: () => Promise<Response<DiscloseDemandCertification>>) => {
    try {
        return await fn();
    } catch (error) {
        if (error instanceof HTTPError && error.response.status === 400) {
            return { error };
        } else {
            throw error;
        }
    }
};

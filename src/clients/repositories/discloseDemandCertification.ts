import { Response } from "../response";
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
        return this.withHttpErrorsHandling<Response<DiscloseDemandCertification>>(() =>
            this.POST<Response<DiscloseDemandCertification>>(parameters),
        );
    }

    protected sub(): string {
        return DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB;
    }
}

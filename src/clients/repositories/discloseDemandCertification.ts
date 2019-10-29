import { Response } from "../response";
import { DiscloseDemand, DiscloseDemandCertification } from "@uns/crypto";
import { ServiceRepository } from "./types/ServiceRepository";

export const DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB: string = "disclose-demand-certification";

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

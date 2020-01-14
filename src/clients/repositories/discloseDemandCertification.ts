import { Response } from "../response";
import { IDiscloseDemand, IDiscloseDemandCertification } from "@uns/crypto";
import { ServiceRepository } from "./types/ServiceRepository";

export const DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB: string = "disclose-demand-certification";

export class DiscloseDemandCertificationRepository extends ServiceRepository {
    public async create(parameters: IDiscloseDemand): Promise<Response<IDiscloseDemandCertification>> {
        return this.withHttpErrorsHandling<IDiscloseDemandCertification>(() =>
            this.POST<Response<IDiscloseDemandCertification>>(parameters),
        );
    }

    protected sub(): string {
        return DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB;
    }
}

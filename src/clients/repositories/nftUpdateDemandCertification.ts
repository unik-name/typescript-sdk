import { Response } from "../response";
import { INftUpdateDemandCertification, INftUpdateDemand } from "@uns/crypto";
import { ServiceRepository } from "./types/ServiceRepository";

export const UPDATE_DEMAND_CERTIFICATION_REPOSITORY_SUB: string = "update-demand-certification";

export class UpdateDemandCertificationRepository extends ServiceRepository {
    public async create(parameters: INftUpdateDemand): Promise<Response<INftUpdateDemandCertification>> {
        return this.withHttpErrorsHandling<INftUpdateDemandCertification>(() =>
            this.POST<Response<INftUpdateDemandCertification>>(parameters),
        );
    }

    protected sub(): string {
        return UPDATE_DEMAND_CERTIFICATION_REPOSITORY_SUB;
    }
}
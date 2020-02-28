import { Response } from "../response";
import { INftMintDemand, INftMintDemandCertification } from "@uns/crypto";
import { ServiceRepository } from "./types/ServiceRepository";
import { CertificationRequestBody } from "../../types";

export const MINT_DEMAND_CERTIFICATION_REPOSITORY_SUB: string = "mint-demand-certification";

export class MintDemandCertificationRepository extends ServiceRepository {
    public async create(
        parameters: CertificationRequestBody<INftMintDemand>,
    ): Promise<Response<INftMintDemandCertification>> {
        return this.withHttpErrorsHandling<INftMintDemandCertification>(() =>
            this.POST<Response<INftMintDemandCertification>>(parameters),
        );
    }

    protected sub(): string {
        return MINT_DEMAND_CERTIFICATION_REPOSITORY_SUB;
    }
}

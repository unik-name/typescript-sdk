import { Response } from "../response";
import { ServiceRepository } from "./types/ServiceRepository";

export const SAFETYPO_REPOSITORY_SUB: string = "safetypo";

export type SafeTypoResult = {
    core: Buffer;
};

export class SafetypoRepository extends ServiceRepository {
    public async analyze(explicitValue: string): Promise<Response<SafeTypoResult>> {
        return this.withHttpErrorsHandling<SafeTypoResult>(() =>
            this.POST<Response<SafeTypoResult>>({ explicitValue }),
        );
    }

    protected sub(): string {
        return SAFETYPO_REPOSITORY_SUB;
    }
}

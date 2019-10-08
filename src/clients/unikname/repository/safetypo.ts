import { Repository } from "../../repository";
import { Response } from "../../response";
import { HTTPError } from "ky-universal";

export const SafetypoRepositorySub: string = "safetypo";

export type SafeTypoResult = {
    core: string;
};

export class SafetypoRepository extends Repository {
    public async analyze(explicitValue: string): Promise<Response<SafeTypoResult>> {
        try {
            const response = await this.POST<Response<SafeTypoResult>>({ explicitValue });
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
        return SafetypoRepositorySub;
    }
}

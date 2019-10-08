import { Repository } from "../../repository";
import { Response } from "../../response";
import { DIDType } from "../../../types";
import { HTTPError } from "ky-universal";

export const FingerprintRepositorySub: string = "unik-name-fingerprint";

export type FingerprintResult = {
    fingerprint: string;
};

export class FingerprintRepository extends Repository {
    public async compute(explicitValue: string, type: DIDType): Promise<Response<FingerprintResult>> {
        try {
            const response = await this.POST<Response<FingerprintResult>>({ explicitValue, type });
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
        return FingerprintRepositorySub;
    }
}

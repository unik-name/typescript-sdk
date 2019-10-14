import { Repository } from "../repository";
import { Response } from "../response";
import { DIDType } from "../../types";
import { HTTPError } from "ky-universal";
import { ServiceRepository } from "./types/ServiceRepository";

export const FINGERPRINT_REPOSITORY_SUB: string = "unik-name-fingerprint";

export type FingerprintResult = {
    fingerprint: string;
};

export class FingerprintRepository extends ServiceRepository {
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
        return FINGERPRINT_REPOSITORY_SUB;
    }
}

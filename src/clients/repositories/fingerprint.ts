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
        return this.withHttpErrorsHandling<Response<FingerprintResult>>(() =>
            this.POST<Response<FingerprintResult>>({ explicitValue, type: type.toLowerCase() }),
        );
    }

    protected sub(): string {
        return FINGERPRINT_REPOSITORY_SUB;
    }
}

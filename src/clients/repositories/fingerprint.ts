import { Response } from "../response";
import { DIDType } from "../../types";
import { ServiceRepository } from "./types/ServiceRepository";

export const FINGERPRINT_REPOSITORY_SUB: string = "unik-name-fingerprint";

export type FingerprintResult = {
    fingerprint: string;
};

export class FingerprintRepository extends ServiceRepository {
    public async compute(explicitValue: string, type: DIDType, nftName: string): Promise<Response<FingerprintResult>> {
        return this.withHttpErrorsHandling<FingerprintResult>(() =>
            this.POST<Response<FingerprintResult>>({ explicitValue, type: type.toLowerCase(), nftName }),
        );
    }

    protected sub(): string {
        return FINGERPRINT_REPOSITORY_SUB;
    }
}

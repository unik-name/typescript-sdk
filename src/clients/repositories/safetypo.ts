/* eslint max-classes-per-file: ["error", 2] */
import { Response } from "../response";
import { ServiceRepository } from "./types/ServiceRepository";
import { DIDScript } from "src/types";

export const SAFETYPO_REPOSITORY_SUB: string = "safetypo";

export interface SafeName {
    core: Buffer;
    coreLength: number;
    explicit: string;
    explicitScript: DIDScript;
    likeness: number;
}

export class SafetypoError extends Error {
    constructor(message: string) {
        super(`SafetypoError : ${message}`);
    }
}

export class SafetypoRepository extends ServiceRepository {
    public async analyze(explicitValue: string): Promise<Response<SafeName | SafetypoError>> {
        return this.withHttpErrorsHandling<SafeName | SafetypoError>(() =>
            this.POST<Response<SafeName | SafetypoError>>({ explicitValue }),
        );
    }

    protected sub(): string {
        return SAFETYPO_REPOSITORY_SUB;
    }
}

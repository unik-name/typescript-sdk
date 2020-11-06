import { DIDScript } from "../../../../did";

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

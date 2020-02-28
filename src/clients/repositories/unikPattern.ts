import { Response } from "../response";
import { DIDTypes } from "@uns/crypto";
import { ServiceRepository } from "./types/ServiceRepository";
import { DIDScript, UNSLengthGroup } from "../../types";

export const UNIK_PATTERN_REPOSITORY_SUB: string = "unik-pattern";

export type UnikPatterRequestBody = {
    explicitValue: string;
    type: DIDTypes;
};

export type UnikPattern = {
    lengthGroup: UNSLengthGroup;
    script: DIDScript;
    didType: DIDTypes;
};

export class UnikPatternRepository extends ServiceRepository {
    public async compute(parameters: UnikPatterRequestBody): Promise<Response<UnikPattern>> {
        return this.withHttpErrorsHandling<UnikPattern>(() => this.POST<Response<UnikPattern>>(parameters));
    }

    protected sub(): string {
        return UNIK_PATTERN_REPOSITORY_SUB;
    }
}

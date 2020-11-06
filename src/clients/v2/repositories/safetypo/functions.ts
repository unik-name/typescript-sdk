import { HTTPClient, Response } from "../..";
import { post } from "../service-repository";
import { SafeName, SafetypoError } from "./types";

export const safetypoAnalyze = (client: HTTPClient) => (
    explicitValue: string,
): Promise<Response<SafeName | SafetypoError>> =>
    post<SafeName | SafetypoError>(client)("safetypo", undefined, { explicitValue });

import { FunctionalError } from "../clients";

export type SdkResult<T> = T | FunctionalError;

export function isError<T>(result: SdkResult<T>): result is FunctionalError {
    return (result as FunctionalError).code !== undefined && (result as FunctionalError).message !== undefined;
}

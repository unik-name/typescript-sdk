import { Config } from "../../../config";
import { Repository } from "../../repository";

export abstract class ServiceRepository extends Repository {
    private static ENDPOINT_SUFFIX = "/api/v1";

    protected abstract sub(): string;

    protected getEndpoint(): Config {
        return this.endpointsConfig.service;
    }

    protected getEnpointSuffix(): string {
        return ServiceRepository.ENDPOINT_SUFFIX;
    }

    protected headers = {
        "Uns-Network": this.endpointsConfig.network,
    };
}

import { Config } from "../../../config";
import { Repository } from "../../repository";

export abstract class ChainRepository extends Repository {
    private static ENDPOINT_SUFFIX = "/api/v2";

    protected abstract sub(): string;

    protected getEnpointSuffix(): string {
        return ChainRepository.ENDPOINT_SUFFIX;
    }

    protected getEndpoint(): Config {
        return this.endpointsConfig.chain;
    }
}

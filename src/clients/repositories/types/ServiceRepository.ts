import { Repository } from "../../repository";
import { Network, Config } from "../../../config";

export abstract class ServiceRepository extends Repository {
    constructor(config: Config) {
        super(config);

        this.headers["Uns-Network"] = this.config.network;
    }

    protected abstract sub(): string;

    protected endpointType(): string {
        return "service";
    }
}

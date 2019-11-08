import { Repository } from "../../repository";
import { UNSConfig, Network } from "../../../config";

export abstract class ServiceRepository extends Repository {
    protected abstract sub(): string;

    protected getEndpoint(network: Network): string {
        return UNSConfig[network].service.url;
    }

    protected headers = {
        "Uns-Network": this.network,
    };
}

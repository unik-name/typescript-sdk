import { Repository } from "../../repository";
import { UNSConfig, Network } from "../../../config";
import { join } from "../../../utils";

export abstract class ChainRepository extends Repository {
    protected abstract sub(): string;

    protected getEndpoint(network: Network): string {
        return UNSConfig[network].chain.url;
    }

    constructor(network: Network, customNode?: string) {
        super(network);
        if (customNode) {
            this.url = join(`${customNode}/api/v2`, this.sub());
        }
    }
}

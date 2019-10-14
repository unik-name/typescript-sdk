import { Repository } from "../../repository";

export abstract class ChainRepository extends Repository {
    protected abstract sub(): string;

    protected endpointType(): string {
        return "chain";
    }
}

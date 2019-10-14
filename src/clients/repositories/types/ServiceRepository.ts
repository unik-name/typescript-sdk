import { Repository } from "../../repository";

export abstract class ServiceRepository extends Repository {
    protected abstract sub(): string;

    protected endpointType(): string {
        return "service";
    }

    protected headers = {
        "Uns-Network": this.network,
    };
}

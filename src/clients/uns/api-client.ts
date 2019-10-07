import { APIClient, APIClientBuilder } from "../builder";
import { HTTPOptions } from "../http";
import { Config, Network, NetworkConfig } from "./config";
import { Resource } from "./resources";
import { FingerPrintResource } from "./resources/fingerprint";
import { Safetypo } from "./resources/safetypo";

const DEFAULT_HEADERS: HTTPOptions = {
    headers: {
        "Content-type": "application/json",
    },
};

export class UniknameClient {
    private api: APIClient;

    constructor(
        protected configOrNetwork: Config | Network = Network.DEVNET,
        protected defaultHeaders: HTTPOptions = DEFAULT_HEADERS,
    ) {
        const config = NetworkConfig[configOrNetwork as Network] || (configOrNetwork as Config);

        this.api = new APIClientBuilder()
            .withHost(config.api)
            .withDefaultHeaders(defaultHeaders)
            .withResource(new FingerPrintResource())
            .withResource(new Safetypo())
            .build();
    }

    public get fingerprint(): FingerPrintResource {
        return this.getResource<FingerPrintResource>(FingerPrintResource.PATH);
    }

    public get safetypo(): Safetypo {
        return this.getResource<Safetypo>(Safetypo.PATH);
    }

    private getResource<T extends Resource>(name: string): T {
        return this.api[name] as T;
    }
}

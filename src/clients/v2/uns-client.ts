import { UNSConfig, UNSEndpointConfig } from "./config";
import * as fingerprint from "./repositories/fingerprint/functions";
import { HTTPClient } from "./http/client";

export class UNSClient {
    private http: HTTPClient;

    constructor(config?: UNSConfig) {
        this.http = new HTTPClient(config);
    }

    public get configuration(): UNSConfig {
        return this.http.config;
    }

    public get currentEndpointsConfig(): UNSEndpointConfig {
        return this.http.config.endpoints;
    }

    public get fingerprint() {
        return {
            compute: fingerprint.compute(this.http),
        };
    }
}

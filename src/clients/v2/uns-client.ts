import { UNSConfig, UNSEndpointConfig } from "./config";
import { HTTPClient } from "./http/client";
import * as fingerprint from "./repositories/fingerprint/functions";
import * as unik from "./repositories/unik/functions";
import * as block from "./repositories/block/functions";

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
            compute: fingerprint.fingerprintCompute(this.http),
        };
    }

    public get unik() {
        return {
            get: unik.unikGet(this.http),
            getUniks: unik.unikSearch(this.http),
            totalCount: unik.unikTotalCount(this.http),
            property: unik.unikProperty(this.http),
            properties: unik.unikProperties(this.http),
        };
    }

    public get block() {
        return {
            last: block.blockLast(this.http),
        };
    }
}

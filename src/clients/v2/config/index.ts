import { Network } from "../../../config";
import { _Headers } from "../http/client";

export enum UNSEndpoint {
    services = "services",
    network = "network",
}

export type UNSEndpointConfig = Record<Network, Record<UNSEndpoint, string>>;

export type UNSConfig = {
    network: Network;
    defaultHeaders: _Headers;
    endpoints: UNSEndpointConfig;
};

export const DEFAULT_UNS_CONFIG: UNSConfig = {
    network: Network.livenet,
    defaultHeaders: {
        "content-type": "application/json",
    },
    endpoints: {
        livenet: {
            network: "https://api.uns.network/api/v2/",
            services: "https://services.unikname.com/api/v1/",
        },
        sandbox: {
            network: "https://relay1.sandbox.uns.network/api/v2/",
            services: "https://services.unikname.com/api/v1/",
        },
        dalinet: {
            network: "https://forger1.dalinet.uns.network/api/v2/",
            services: "https://integ.services.unikname.com/api/v1/",
        },
        testnet: {
            network: "http://localhost:4003/api/v2/",
            services: "https://integ.services.unikname.com/api/v1/",
        },
    },
};

export enum Network {
    sandbox = "sandbox",
    dalinet = "dalinet",
    default = dalinet,
    testnet = "testnet",
}

export type Config = {
    url: string;
    customValue: boolean;
};

export type EndpointsConfig = {
    network: Network;
    chain: Config;
    service: Config;
};

export const UNSConfig: Record<Network, EndpointsConfig> = {
    sandbox: {
        network: Network.sandbox,
        chain: {
            url: "https://relay1.sandbox.uns.network",
            customValue: false,
        },
        service: {
            url: "https://services.unik-name.com",
            customValue: false,
        },
    },
    dalinet: {
        network: Network.dalinet,
        chain: {
            url: "https://forger1.dalinet.uns.network",
            customValue: false,
        },
        service: {
            url: "https://integ.services.unik-name.com",
            customValue: false,
        },
    },
    testnet: {
        network: Network.testnet,
        chain: {
            url: "http://localhost:4003",
            customValue: false,
        },
        service: {
            url: "https://integ.services.unik-name.com",
            customValue: false,
        },
    },
};

export type UNSClientConfig = {
    network: Network;
    customNode?: string;
    headers?: { [_: string]: string };
};

export const DEFAULT_CLIENT_CONFIG: UNSClientConfig = { network: Network.default };

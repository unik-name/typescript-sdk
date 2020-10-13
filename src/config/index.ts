export enum Network {
    livenet = "livenet",
    sandbox = "sandbox",
    dalinet = "dalinet",
    default = livenet,
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
    livenet: {
        network: Network.livenet,
        chain: {
            url: "https://api.uns.network",
            customValue: false,
        },
        service: {
            url: "https://services.unikname.com",
            customValue: false,
        },
    },
    sandbox: {
        network: Network.sandbox,
        chain: {
            url: "https://relay1.sandbox.uns.network",
            customValue: false,
        },
        service: {
            url: "https://services.unikname.com",
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
            url: "https://integ.services.unikname.com",
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
            url: "https://integ.services.unikname.com",
            customValue: false,
        },
    },
};

export type UNSClientConfig = {
    network: Network;
    customNode?: string;
    customServices?: string;
    headers?: { [_: string]: string };
};

export const DEFAULT_CLIENT_CONFIG: UNSClientConfig = { network: Network.default };

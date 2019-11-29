export enum Network {
    devnet = "devnet",
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
    devnet: {
        network: Network.devnet,
        chain: {
            url: "https://forger1.devnet.uns.network",
            customValue: false,
        },
        service: {
            url: "https://us-central1-unik-name.cloudfunctions.net",
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
            url: "https://us-central1-unik-name-development.cloudfunctions.net",
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
            url: "https://us-central1-unik-name-development.cloudfunctions.net",
            customValue: false,
        },
    },
};

export type UNSClientConfig = {
    network: Network;
    customNode?: string;
};

export const DEFAULT_CLIENT_CONFIG: UNSClientConfig = { network: Network.default };

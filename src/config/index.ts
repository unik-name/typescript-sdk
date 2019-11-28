export enum Network {
    devnet = "devnet",
    dalinet = "dalinet",
    testnet = "testnet",
}

export type Config = {
    url: string;
};

export type EndpointsConfig = {
    chain: Config;
    service: Config;
};

export const UNSConfig: Record<Network, EndpointsConfig> = {
    devnet: {
        chain: {
            url: "https://forger1.devnet.uns.network/api/v2",
        },
        service: {
            url: "https://us-central1-unik-name.cloudfunctions.net/api/v1",
        },
    },
    dalinet: {
        chain: {
            url: "https://forger1.dalinet.uns.network/api/v2",
        },
        service: {
            url: "https://us-central1-unik-name-development.cloudfunctions.net/api/v1",
        },
    },
    testnet: {
        chain: {
            url: "http://localhost:4003/api/v2",
        },
        service: {
            url: "https://us-central1-unik-name-development.cloudfunctions.net/api/v1",
        },
    },
};

export type UNSClientConfig = {
    network: Network;
    customNode?: string;
};

export const DEFAULT_CLIENT_CONFIG: UNSClientConfig = { network: Network.dalinet };

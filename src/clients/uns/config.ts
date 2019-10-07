export enum Network {
    // MAINNET = "MAINNET",
    DEVNET = "DEVNET",
    DALINET = "DALINET",
    TESTNET = "TESTNET",
}

export interface Config {
    endpoint: string;
    api: string;
}

export const NetworkConfig: Record<Network, Config> = {
    DEVNET: {
        endpoint: "https://forger1.devnet.uns.network/api/v2",
        api: "https://us-central1-unik-name.cloudfunctions.net/api/v1",
    },
    DALINET: {
        endpoint: "https://forger1.dalinet.uns.network/api/v2",
        api: "https://us-central1-unik-name-integration.cloudfunctions.net/api/v1",
    },
    TESTNET: {
        endpoint: "http://localhost:4003/api/v2",
        api: "https://us-central1-unik-name-development.cloudfunctions.net/api/v1",
    },
};

export enum Network {
    devnet = "devnet",
    dalinet = "dalinet",
    testnet = "testnet",
}

export type Config = {
    url: string;
};

export const UNSConfig: Record<Network, Config> = {
    devnet: {
        url: "https://forger1.devnet.uns.network/api/v2",
    },
    dalinet: {
        url: "https://forger1.dalinet.uns.network/api/v2",
    },
    testnet: {
        url: "http://localhost:4003/api/v2",
    },
};

export const UniknameConfig: Record<Network, Config> = {
    devnet: {
        url: "https://us-central1-unik-name.cloudfunctions.net/api/v1",
    },
    dalinet: {
        url: "ttps://us-central1-unik-name-development.cloudfunctions.net/api/v1",
    },
    testnet: {
        url: "https://us-central1-unik-name-development.cloudfunctions.net/api/v1",
    },
};

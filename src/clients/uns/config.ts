export enum Network {
    // MAINNET = "MAINNET",
    DEVNET = "DEVNET",
    TESTNET = "TESTNET",
}

export type Config = {
    endpoint: string;
};

export const NetworkConfig: Record<Network, Config> = {
    DEVNET: { endpoint: "https://forger1.devnet.uns.network/api/v2" },
    TESTNET: { endpoint: "http://localhost:4103" },
};

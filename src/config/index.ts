export enum Network {
    devnet = "devnet",
    dalinet = "dalinet",
    testnet = "testnet",
}

type Url = {
    url: string;
};

type EndpointsConfig = {
    chain: Url;
    service: Url;
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

export type Config = {
    network: Network;
    headers: { [_: string]: string };
};

/**
 * Function to check if an object is a `Config` type.
 *
 * Ugly.
 *
 * That's the way Typescript works.
 *
 * See https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
 * @param config Object that is maybe a `Config`
 */
export function isConfig(config: any): config is Config {
    return config.network !== undefined && config.headers !== undefined;
}

export function fromNetwork(networkKey: keyof typeof Network): Config {
    return {
        network: Network[networkKey],
        headers: {},
    };
}

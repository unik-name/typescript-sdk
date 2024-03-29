import nock = require("nock");
import { Network, Tokens, UNSClient } from "../../../src";

export const NETWORK = Network.default;

export const UNS_CLIENT_FOR_TESTS = new UNSClient();
UNS_CLIENT_FOR_TESTS.init({ network: NETWORK });

export const CHAIN_ENDPOINT = UNS_CLIENT_FOR_TESTS.currentEndpointsConfig.network;
export const API_ENDPOINT = UNS_CLIENT_FOR_TESTS.currentEndpointsConfig.services;

export function mockWalletTokens(address: string, tokens: Tokens, times: number = 1): void {
    nock(CHAIN_ENDPOINT)
        .get(`/wallets/${address}/uniks`)
        .times(times)
        .reply(200, {
            data: tokens,
        });
}

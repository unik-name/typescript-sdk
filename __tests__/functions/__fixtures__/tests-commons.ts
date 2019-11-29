import { Network, UNSClient } from "../../../src";

export const NETWORK = Network.default;

export const UNS_CLIENT_FOR_TESTS = new UNSClient();
UNS_CLIENT_FOR_TESTS.init({ network: NETWORK });

export const CHAIN_ENDPOINT = UNS_CLIENT_FOR_TESTS.currentEndpointsConfig.chain.url;
export const API_ENDPOINT = UNS_CLIENT_FOR_TESTS.currentEndpointsConfig.service.url;

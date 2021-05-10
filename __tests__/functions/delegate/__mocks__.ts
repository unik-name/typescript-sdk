import nock = require("nock");
import { CHAIN_ENDPOINT } from "../__fixtures__/tests-commons";

export const mockNodeStatus = (data: any) =>
    nock(CHAIN_ENDPOINT)
        .get(`/node/status`)
        .reply(200, { data });

export const mockNodeConfig = (data: any) =>
    nock(CHAIN_ENDPOINT)
        .get(`/node/configuration`)
        .reply(200, { data });
export const mockRoundDelegates = (roundId: number, data: any) =>
    nock(CHAIN_ENDPOINT)
        .get(`/rounds/${roundId}/delegates`)
        .reply(200, { data });
export const mockDelegates = (data: any) =>
    nock(CHAIN_ENDPOINT)
        .get(`/delegates`)
        .reply(200, { data });
export const mockUnikSearch = (data: any) =>
    nock(CHAIN_ENDPOINT)
        .post(`/uniks/search`)
        .reply(201, { data });
export const mockDelegate = (id: string, data: any) =>
    nock(CHAIN_ENDPOINT)
        .get(`/delegates/${id}`)
        .reply(200, { data });
export const mockUnik = (id: string, data: any) =>
    nock(CHAIN_ENDPOINT)
        .get(`/uniks/${id}`)
        .reply(200, { data });
export const mockWallet = (address: string, data: any) =>
    nock(CHAIN_ENDPOINT)
        .get(`/wallets/${address}`)
        .reply(200, { data });

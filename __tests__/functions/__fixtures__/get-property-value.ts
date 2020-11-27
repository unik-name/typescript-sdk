import nock = require("nock");
import { ResponseWithChainMeta, Unik } from "../../../src";
import { CHAIN_ENDPOINT } from "./tests-commons";

export const UNIK_FINGERPRINT: string = "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77";
const WALLET_ADDRESS: string = "DQLiVPs2b6rHYCANjVk7vWVfQqdo5rLvDU";
const TRANSACTION_ID: string = "1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986";

export const META = {
    height: "33",
    timestamp: {
        epoch: 79391124,
        unix: 1569488724,
        human: "2019-09-26T09:05:24.000Z",
    },
};

export const resolvedUnikToken: ResponseWithChainMeta<Unik> = {
    data: {
        id: UNIK_FINGERPRINT,
        ownerId: WALLET_ADDRESS,
        transactions: {
            first: {
                id: TRANSACTION_ID,
            },
            last: {
                id: TRANSACTION_ID,
            },
        },
    },
    chainmeta: META,
    confirmations: 20,
};

export const mockTransactionRequest = () => {
    nock(CHAIN_ENDPOINT)
        .get("/transactions/1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986")
        .reply(200, {
            data: {
                id: "1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986",
                confirmations: 20,
            },
            chainmeta: META,
        });
};

export const mockPropertyRequest = (propertyKey: string, propertyValue: string | number) => {
    nock(CHAIN_ENDPOINT)
        .get(`/uniks/${UNIK_FINGERPRINT}/properties/${propertyKey}`)
        .reply(200, {
            data: propertyValue,
            chainmeta: META,
        });
};

export function mockNftStatus(status: any = {}, times: number = 1): void {
    nock(CHAIN_ENDPOINT)
        .get(`/nfts/status`)
        .times(times)
        .reply(200, {
            data: [status],
        });
}

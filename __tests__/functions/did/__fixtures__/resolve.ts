import { Unik, UNSConfig, UniknameConfig, DidResolution } from "../../../../src";
import nock = require("nock");

const UNIK_FINGERPRINT: string = "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77";
export const WALLET_ADDRESS: string = "DQLiVPs2b6rHYCANjVk7vWVfQqdo5rLvDU";
const TRANSACTION_ID: string = "1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986";

const CHAIN_ENDPOINT = UNSConfig.devnet.url;
const API_ENDPOINT = UniknameConfig.devnet.url;

export const META = {
    height: "33",
    timestamp: {
        epoch: 79391124,
        unix: 1569488724,
        human: "2019-09-26T09:05:24.000Z",
    },
};

export const RESOLVED_UNIK_TOKEN: DidResolution<Unik> = {
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

export const mockSafetypoRequest = () => {
    nock(API_ENDPOINT)
        .post("/safetypo/")
        .reply(200, {
            data: {
                core: "rnyun1knarne",
            },
        });
};

export const mockFingerprintRequest = () => {
    nock(API_ENDPOINT)
        .post("/unik-name-fingerprint/")
        .reply(200, {
            data: {
                fingerprint: "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77",
            },
        });
};

export const mockUnikRequest = () => {
    nock(CHAIN_ENDPOINT)
        .get("/uniks/a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77")
        .reply(200, {
            ...RESOLVED_UNIK_TOKEN,
        });
};

export const mockPropertyRequest = () => {
    nock(CHAIN_ENDPOINT)
        .get("/uniks/a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77/properties/type")
        .reply(200, {
            data: "1",
            chainmeta: META,
        });
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

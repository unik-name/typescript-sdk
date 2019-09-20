import { didResolve } from "../../src/functions/did-resolve";
import nock = require("nock");
import { NetworkConfig, Network } from "../../src/clients/uns/config";
import { UnikToken } from "../../src/clients/uns/resources/uniks";
import { ResourceWithChainMeta } from "../../src/clients/uns/resources";

const UNIK_FINGERPRINT: string = "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77";
const WALLET_ADDRESS: string = "DQLiVPs2b6rHYCANjVk7vWVfQqdo5rLvDU";
const TRANSACTION_ID: string = "1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986";

const CHAIN_ENDPOINT = NetworkConfig[Network.DEVNET].endpoint;
const API_ENDPOINT = NetworkConfig[Network.DEVNET].api;

const meta = {
    height: "33",
    timestamp: {
        epoch: 79391124,
        unix: 1569488724,
        human: "2019-09-26T09:05:24.000Z",
    },
};

const resolvedUnikToken: ResourceWithChainMeta<UnikToken> = {
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
    chainmeta: meta,
    confirmations: 20,
};

const mockSafetypoRequest = () => {
    nock(API_ENDPOINT)
        .post("/safetypo/", { body: { explicitValue: "myUnikName" } })
        .reply(200, {
            data: {
                core: "rnyun1knarne",
            },
        });
};

const mockFingerprintRequest = () => {
    nock(API_ENDPOINT)
        .post("/unik-name-fingerprint/", { body: { explicitValue: "myUnikName", type: "individual" } })
        .reply(200, {
            data: {
                fingerprint: "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77",
            },
        });
};

const mockUnikRequest = () => {
    nock(CHAIN_ENDPOINT)
        .get("/uniks/a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77")
        .reply(200, {
            ...resolvedUnikToken,
        });
};

const mockPropertyRequest = () => {
    nock(CHAIN_ENDPOINT)
        .get("/uniks/a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77/properties/type")
        .reply(200, {
            data: "1",
            chainmeta: meta,
        });
};

const mockTransactionRequest = () => {
    nock(CHAIN_ENDPOINT)
        .get("/transactions/1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986")
        .reply(200, {
            data: {
                id: "1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986",
                confirmations: 20,
            },
            chainmeta: meta,
        });
};

beforeEach(() => {
    nock.cleanAll();
});

describe("DID Resolver", () => {
    beforeAll(() => {
        mockSafetypoRequest();
        mockFingerprintRequest();
    });

    it("should return UNIK token", async () => {
        mockUnikRequest();
        mockTransactionRequest();
        const resolved = await didResolve("@unik:individual/myUnikName");
        expect(resolved).toEqual(resolvedUnikToken);
    });

    it("should return UNIK token wallet owner id id", async () => {
        mockUnikRequest();
        mockTransactionRequest();
        const resolved = await didResolve("@unik:individual/myUnikName?*");
        expect(resolved).toEqual({ data: WALLET_ADDRESS, chainmeta: meta, confirmations: 20 });
    });

    it("should return UNIK token type property value", async () => {
        mockUnikRequest();
        mockPropertyRequest();
        mockTransactionRequest();
        const resolved = await didResolve("@unik:individual/myUnikName?type");
        expect((resolved as ResourceWithChainMeta<string>).data).toEqual("1");
    });
});

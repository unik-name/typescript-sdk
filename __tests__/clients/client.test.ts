import nock = require("nock");
import { DIDTypes, IDiscloseDemandCertification } from "@uns/crypto";
import {
    FingerprintResult,
    Network,
    NodeStatus,
    Response,
    ResponseWithChainMeta,
    Transaction,
    UNSClient,
    Wallet,
    SafetypoError,
    SafeName,
    DEFAULT_UNS_CONFIG,
} from "../../src";
import {
    chainmeta,
    discloseDemandCertification,
    fingerprintResponse,
    parameters,
    safetypoResponse,
    wallet,
    walletId,
    walletResponse,
} from "./__fixtures__";

describe("UNSClient", () => {
    beforeEach(() => {
        nock.cleanAll();
    });
    describe("chain APIs", () => {
        const client = new UNSClient();
        client.init({ network: Network.sandbox });
        const url = DEFAULT_UNS_CONFIG.endpoints.sandbox.network;
        const mock = nock(url);

        describe("node", () => {
            const nodeMock = mock.get("/node/status");

            it("should return a valid NodeStatus object", async () => {
                expect.assertions(2);

                const response = {
                    data: {
                        synced: true,
                        now: 157201,
                        blocksCount: -157201,
                    },
                };

                nodeMock.reply(200, response);

                const nodeStatus: Response<NodeStatus> = await client.node.status();
                expect(nodeStatus.data).toStrictEqual(response.data);
                expect(nodeStatus.error).toBeUndefined();
            });

            it("should throw an error on not 200 HTTP response", async () => {
                expect.assertions(1);

                nodeMock.reply(400);

                await expect(client.node.status()).rejects.toThrowError();
            });

            it("should broadcast exceptions", async () => {
                expect.assertions(1);

                nodeMock.reply(200, () => {
                    throw new Error("custom error");
                });

                await expect(client.node.status()).rejects.toThrowError("custom error");
            });
        });

        describe("wallets", () => {
            const walletMock = mock.get(`/wallets/${walletId}`);

            it("get should return wallet with chainmeta", async () => {
                walletMock.reply(200, walletResponse);

                const retrievedWallet: ResponseWithChainMeta<Wallet> = await client.wallet.get(walletId);
                expect(retrievedWallet.data).toStrictEqual(wallet);
                expect(retrievedWallet.chainmeta).toStrictEqual(chainmeta);
            });
        });

        describe("transactions", () => {
            const transactionMock = (id: string) => mock.get(`/transactions/${id}`);

            it("should return Transaction with chainmeta", async () => {
                expect.assertions(3);

                const response = {
                    data: {
                        id: "1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986",
                        confirmations: 20,
                        timestamp: {
                            epoch: 298879,
                            unix: 1569013785,
                            human: "2019-09-20T21:09:45.000Z",
                        },
                    },
                    chainmeta: {
                        height: "33",
                        timestamp: {
                            epoch: 79391124,
                            unix: 1569488724,
                            human: "2019-09-26T09:05:24.000Z",
                        },
                    },
                };

                transactionMock(response.data.id).reply(200, response);
                const client = new UNSClient();
                client.init({ network: Network.sandbox });
                const result: ResponseWithChainMeta<Transaction> = await client.transaction.get(response.data.id);
                expect(result.data).toStrictEqual(response.data);
                expect(result.chainmeta).toStrictEqual(response.chainmeta);
                expect(result.error).toBeUndefined();
            });

            it("should throw an exception when not found", async () => {
                const id = "invalidId";

                transactionMock(id).reply(404);
                const client = new UNSClient();
                client.init({ network: Network.sandbox });

                await expect(client.transaction.get(id)).rejects.toThrowError("Not Found");
            });

            describe("unconfirmed transactions", () => {
                const unconfirmedTransactionMock = () => mock.get(`/transactions/unconfirmed`);

                it("should call right endpoint", async () => {
                    expect.assertions(1);

                    unconfirmedTransactionMock().reply(200, uri => {
                        expect(uri.endsWith("/transactions/unconfirmed")).toBe(true);
                        return {};
                    });

                    const client = new UNSClient();
                    client.init({ network: Network.sandbox });
                    await client.transaction.unconfirmed();
                });

                it("should compute pagination query", async () => {
                    expect.assertions(2);
                    const limit = 1,
                        page = 2;

                    unconfirmedTransactionMock()
                        .query(true)
                        .reply(200, uri => {
                            const params = new URLSearchParams(new URL(`${url}${uri}`).search);
                            expect(params.get("limit")).toBe(`${limit}`);
                            expect(params.get("page")).toBe(`${page}`);
                            return {};
                        });

                    const client = new UNSClient();
                    client.init({ network: Network.sandbox });
                    await client.transaction.unconfirmed({ limit, page });
                });
            });
        });

        describe("unik", () => {
            const unikMock = (id: string) => mock.get(`/uniks/${id}`);

            describe("get", () => {
                it("should return a Unik with chain meta", async () => {
                    expect.assertions(1);

                    const response = {
                        data: {
                            id: "51615becbd39ad96344919dffa7b972f293b0a3973b05145fd6d0a1a20cac169",
                            ownerId: "SQ377ETcezsrPamYsQE4FyiXkXcUxhSsFW",
                            transactions: {
                                first: {
                                    id: "d05caaf67e5e04a0d6bef4463ec808ba1527b54bcb36f3c9d188cb6202930900",
                                },
                                last: {
                                    id: "15e9cb095e6845ea1601a5f111aa43a616e76181fdf478840c3387d95e2c7703",
                                },
                            },
                        },
                        chainmeta: {
                            height: "33",
                            timestamp: {
                                epoch: 79391124,
                                unix: 1569488724,
                                human: "2019-09-26T09:05:24.000Z",
                            },
                        },
                    };

                    unikMock(response.data.id).reply(200, response);

                    const result = await client.unik.get(response.data.id);
                    expect(result).toStrictEqual(response);
                });

                it("should throw an error on not 200 http code", async () => {
                    expect.assertions(1);

                    const id = "invalidId";

                    unikMock(id).reply(404);

                    await expect(client.unik.get(id)).rejects.toThrowError("Not Found");
                });
            });

            describe("property", () => {
                const propertyMock = (id: string, key: string) => mock.get(`/uniks/${id}/properties/${key}`);

                it("should return unik property with chain meta", async () => {
                    expect.assertions(1);

                    const id = "1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986";
                    const key = "type";
                    const response = {
                        data: 1,
                        chainmeta: {
                            height: "33",
                            timestamp: {
                                epoch: 79391124,
                                unix: 1569488724,
                                human: "2019-09-26T09:05:24.000Z",
                            },
                        },
                    };

                    propertyMock(id, key).reply(200, response);

                    const result = await client.unik.property(id, key);
                    expect(result).toStrictEqual(response);
                });

                it("should throw an error on not 200 http code", async () => {
                    expect.assertions(1);

                    const id = "1473aa7b0d95ccbe66da2a06bc4f279c671e15fb02b7b6a69038b749265f2986";
                    const key = "type";

                    propertyMock(id, key).reply(404);
                    await expect(client.unik.property(id, key)).rejects.toThrowError("Not Found");
                });
            });
        });
    });

    describe("service APIs", () => {
        const client = new UNSClient();
        client.init({ network: Network.sandbox });

        let mock: nock.Scope;

        beforeEach(() => {
            mock = nock(DEFAULT_UNS_CONFIG.endpoints.sandbox.services);
        });

        describe("headers", () => {
            it("should send http request with uns-network header", async () => {
                expect.assertions(1);

                const fn = jest.fn().mockReturnValue(safetypoResponse);

                mock.matchHeader("Uns-Network", "sandbox")
                    .post("/safetypo")
                    .reply(200, fn);

                await client.safetypo.analyze("explicitValue");
                expect(fn).toHaveBeenCalled();
            });

            it("should send http request with custom header", async () => {
                expect.assertions(1);

                const fn = jest.fn().mockReturnValue(safetypoResponse);

                mock.matchHeader("Uns-Network", "sandbox")
                    .matchHeader("CustomHeader", "customValue")
                    .post("/safetypo")
                    .reply(200, fn);

                const clientWithHeader = new UNSClient();
                clientWithHeader.init({
                    network: Network.sandbox,
                    defaultHeaders: {
                        CustomHeader: "customValue",
                    },
                });
                await clientWithHeader.safetypo.analyze("explicitValue");
                expect(fn).toHaveBeenCalled();
            });
        });

        describe("safetypo", () => {
            let safetypoMock: nock.Interceptor;

            beforeEach(() => {
                safetypoMock = mock.post("/safetypo");
            });

            it("should return a safetypo result", async () => {
                expect.assertions(2);
                safetypoMock.reply(200, safetypoResponse);

                const result: Response<SafeName | SafetypoError> = await client.safetypo.analyze(
                    safetypoResponse.data.explicit,
                );

                expect(Buffer.from((result.data as SafeName).core as Buffer)).toStrictEqual(safetypoResponse.data.core);
                expect(result.error).toBeUndefined();
            });

            it("should return a functional error", async () => {
                expect.assertions(2);

                safetypoMock.reply(400);

                const result: Response<SafeName | SafetypoError> = await client.safetypo.analyze(
                    safetypoResponse.data.explicit,
                );
                expect(result.error).not.toBeUndefined();
                expect(result.data).toBeUndefined();
            });

            it("should throw an exception", async () => {
                expect.assertions(1);

                safetypoMock.reply(500);

                await expect(client.safetypo.analyze(safetypoResponse.data.explicit)).rejects.toThrowError(
                    "Internal Server Error",
                );
            });

            it("should broadcast exception", async () => {
                expect.assertions(1);

                safetypoMock.reply(200, () => {
                    throw new Error("this is a custom error");
                });

                await expect(client.safetypo.analyze(safetypoResponse.data.explicit)).rejects.toThrowError(
                    "this is a custom error",
                );
            });
        });

        describe("unik-name-fingerprint", () => {
            let fingerprintMock: nock.Interceptor;

            beforeEach(() => {
                fingerprintMock = mock.post("/unik-name-fingerprint");
            });

            it("should return a fingerprint", async () => {
                expect.assertions(2);

                fingerprintMock.reply(200, fingerprintResponse);

                const result = await client.fingerprint.compute("myUnikName", DIDTypes.INDIVIDUAL, "UNIK");
                expect(result.data).toStrictEqual(fingerprintResponse.data);
                expect(result.error).toBeUndefined();
            });

            it("should return a functional error", async () => {
                expect.assertions(2);

                fingerprintMock.reply(400);

                const result: Response<FingerprintResult> = await client.fingerprint.compute(
                    "toto",
                    DIDTypes.INDIVIDUAL,
                    "UNIK",
                );
                expect(result.error).not.toBeUndefined();
                expect(result.data).toBeUndefined();
            });

            it("should throw an exception on 500 http code", async () => {
                expect.assertions(1);

                fingerprintMock.reply(500);

                await expect(client.fingerprint.compute("toto", DIDTypes.INDIVIDUAL, "UNIK")).rejects.toThrowError(
                    "Internal Server Error",
                );
            });

            it("should broadcast exception", async () => {
                expect.assertions(1);

                fingerprintMock.reply(200, () => {
                    throw new Error("this is a custom error");
                });

                await expect(client.fingerprint.compute("toto", DIDTypes.INDIVIDUAL, "UNIK")).rejects.toThrowError(
                    "this is a custom error",
                );
            });
        });

        describe("discloseDemandCertification", () => {
            const discloseDemandCertificationMock = () => mock.post("/disclose-demand-certification");

            it("should return a DiscloseDemandCertification", async () => {
                expect.assertions(1);

                discloseDemandCertificationMock().reply(200, discloseDemandCertification);

                const certification = await client.discloseDemandCertification.create(parameters);
                expect(certification).toStrictEqual(discloseDemandCertification);
            });

            it("should return a functional error", async () => {
                expect.assertions(2);

                discloseDemandCertificationMock().reply(400);

                const result: Response<IDiscloseDemandCertification> = await client.discloseDemandCertification.create(
                    parameters,
                );
                expect(result.error).toBeDefined();
                expect(result.data).toBeUndefined();
            });

            it("should throw an exception on 500 http code", async () => {
                expect.assertions(1);

                discloseDemandCertificationMock().reply(500);

                await expect(client.discloseDemandCertification.create(parameters)).rejects.toThrowError(
                    "Internal Server Error",
                );
            });

            it("should broadcast exception", async () => {
                expect.assertions(1);

                discloseDemandCertificationMock().reply(200, () => {
                    throw new Error("this is a custom error");
                });

                await expect(client.discloseDemandCertification.create(parameters)).rejects.toThrowError(
                    "this is a custom error",
                );
            });
        });
    });
});

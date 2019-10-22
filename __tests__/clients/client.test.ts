import nock = require("nock");
import {
    UNSClient,
    NodeStatus,
    Response,
    UNSConfig,
    ResponseWithChainMeta,
    Transaction,
    Network,
    SafeTypoResult,
    FingerprintResult,
} from "../../src";
import {
    parameters,
    discloseDemandCertification,
    safetypoResponse,
    fingerprintResponse,
    walletId,
    walletResponse,
    wallet,
    chainmeta,
} from "./__fixtures__";
import { DiscloseDemandCertification } from "../../src/clients/repositories";
import { Wallet } from "../../src/clients/repositories/wallet";

describe("UNSClient", () => {
    let client;
    let mock;
    describe("chain APIs", () => {
        beforeEach(() => {
            client = new UNSClient(Network.devnet);
            mock = nock(UNSConfig.devnet.chain.url);
        });

        describe("node", () => {
            let nodeMock;

            beforeEach(() => {
                nodeMock = mock.get("/node/status");
            });

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
            let walletMock;

            beforeEach(() => {
                walletMock = mock.get(`/wallets/${walletId}`);
            });

            it("get should return wallet with chainmeta", async () => {
                walletMock.reply(200, walletResponse);

                const retrievedWallet: ResponseWithChainMeta<Wallet> = await client.wallet.get(walletId);
                expect(retrievedWallet.data).toStrictEqual(wallet);
                expect(retrievedWallet.chainmeta).toStrictEqual(chainmeta);
            });
        });

        describe("transactions", () => {
            let transactionMock;

            beforeEach(() => {
                transactionMock = id => mock.get(`/transactions/${id}`);
            });

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

                const result: ResponseWithChainMeta<Transaction> = await new UNSClient(Network.devnet).transaction.get(
                    response.data.id,
                );
                expect(result.data).toStrictEqual(response.data);
                expect(result.chainmeta).toStrictEqual(response.chainmeta);
                expect(result.error).toBeUndefined();
            });

            it("should throw an exception when not found", async () => {
                const id = "invalidId";

                transactionMock(id).reply(404);

                await expect(new UNSClient(Network.devnet).transaction.get(id)).rejects.toThrowError("Not Found");
            });
        });

        describe("unik", () => {
            let unikMock;

            beforeEach(() => {
                unikMock = id => mock.get(`/uniks/${id}`);
            });

            describe("get", () => {
                it("should return a Unik with chain meta", async () => {
                    expect.assertions(1);

                    const response = {
                        data: {
                            id: "51615becbd39ad96344919dffa7b972f293b0a3973b05145fd6d0a1a20cac169",
                            ownerId: "DQ377ETcezsrPamYsQE4FyiXkXcUxhSsFW",
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
                let propertyMock;

                beforeEach(() => {
                    propertyMock = (id, key) => mock.get(`/uniks/${id}/properties/${key}`);
                });

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
        beforeEach(() => {
            client = new UNSClient(Network.devnet);
            mock = nock(UNSConfig.devnet.service.url);
        });

        describe("default headers", () => {
            it("should send http request with uns-network header", async () => {
                expect.assertions(1);

                const fn = jest.fn().mockReturnValue(safetypoResponse);

                mock.matchHeader("Uns-Network", "devnet")
                    .post("/safetypo/")
                    .reply(200, fn);

                await client.safetypo.analyze("explicitValue");
                expect(fn).toHaveBeenCalled();
            });
        });

        describe("safetypo", () => {
            let safetypoMock;

            beforeEach(() => {
                safetypoMock = mock.post("/safetypo/");
            });

            it("should return a safetypo result", async () => {
                expect.assertions(2);

                safetypoMock.reply(200, safetypoResponse);

                const result: Response<SafeTypoResult> = await client.safetypo.analyze(safetypoResponse.data.core);
                expect(result.data).toStrictEqual(safetypoResponse.data);
                expect(result.error).toBeUndefined();
            });

            it("should return a functional error", async () => {
                expect.assertions(2);

                safetypoMock.reply(400);

                const result: Response<SafeTypoResult> = await client.safetypo.analyze(safetypoResponse.data.core);
                expect(result.error).not.toBeUndefined();
                expect(result.data).toBeUndefined();
            });

            it("should throw an exception", async () => {
                expect.assertions(1);

                safetypoMock.reply(500);

                await expect(client.safetypo.analyze(safetypoResponse.data.core)).rejects.toThrowError(
                    "Internal Server Error",
                );
            });

            it("should broadcast exception", async () => {
                expect.assertions(1);

                safetypoMock.reply(200, () => {
                    throw new Error("this is a custom error");
                });

                await expect(client.safetypo.analyze(safetypoResponse.data.core)).rejects.toThrowError(
                    "this is a custom error",
                );
            });
        });

        describe("unik-name-fingerprint", () => {
            let fingerprintMock;

            beforeEach(() => {
                fingerprintMock = mock.post("/unik-name-fingerprint/");
            });

            it("should return a fingerprint", async () => {
                expect.assertions(2);

                fingerprintMock.reply(200, fingerprintResponse);

                const result = await client.fingerprint.compute("myUnikName", "INDIVIDUAL");
                expect(result.data).toStrictEqual(fingerprintResponse.data);
                expect(result.error).toBeUndefined();
            });

            it("should return a functional error", async () => {
                expect.assertions(2);

                fingerprintMock.reply(400);

                const result: Response<FingerprintResult> = await client.fingerprint.compute("toto", "INDIVIDUAL");
                expect(result.error).not.toBeUndefined();
                expect(result.data).toBeUndefined();
            });

            it("should throw an exception on 500 http code", async () => {
                expect.assertions(1);

                fingerprintMock.reply(500);

                await expect(client.fingerprint.compute("toto", "INDIVIDUAL")).rejects.toThrowError(
                    "Internal Server Error",
                );
            });

            it("should broadcast exception", async () => {
                expect.assertions(1);

                fingerprintMock.reply(200, () => {
                    throw new Error("this is a custom error");
                });

                await expect(client.fingerprint.compute("toto", "INDIVIDUAL")).rejects.toThrowError(
                    "this is a custom error",
                );
            });
        });

        describe("discloseDemandCertification", () => {
            let discloseDemandCertificationMock;

            beforeEach(() => {
                discloseDemandCertificationMock = () => mock.post("/disclose-demand-certification/");
            });

            it("should return a DiscloseDemandCertification", async () => {
                expect.assertions(1);

                discloseDemandCertificationMock().reply(200, discloseDemandCertification);

                const certification = await client.discloseDemandCertification.get(parameters);
                expect(certification).toStrictEqual(discloseDemandCertification);
            });

            it("should return a functional error", async () => {
                expect.assertions(2);

                discloseDemandCertificationMock().reply(400);

                const result: Response<DiscloseDemandCertification> = await client.discloseDemandCertification.get(
                    parameters,
                );
                expect(result.error).toBeDefined();
                expect(result.data).toBeUndefined();
            });

            it("should throw an exception on 500 http code", async () => {
                expect.assertions(1);

                discloseDemandCertificationMock().reply(500);

                await expect(client.discloseDemandCertification.get(parameters)).rejects.toThrowError(
                    "Internal Server Error",
                );
            });

            it("should broadcast exception", async () => {
                expect.assertions(1);

                discloseDemandCertificationMock().reply(200, () => {
                    throw new Error("this is a custom error");
                });

                await expect(client.discloseDemandCertification.get(parameters)).rejects.toThrowError(
                    "this is a custom error",
                );
            });
        });
    });
});

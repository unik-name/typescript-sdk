import nock = require("nock");
import { UniknameClient, SafeTypoResult, Response, UniknameConfig, FingerprintResult } from "../../../src";

describe("UniknameClient", () => {
    const client = new UniknameClient();

    describe("safetypo", () => {
        beforeEach(() => {
            nock.cleanAll();
        });

        it("should return a safetypo result", async () => {
            expect.assertions(2);

            const response = { data: { core: "b0b" } };

            nock(UniknameConfig.devnet.url)
                .post("/safetypo/")
                .reply(200, response);

            const result: Response<SafeTypoResult> = await client.safetypo.analyze("b0b");
            expect(result.data).toStrictEqual(response.data);
            expect(result.error).toBeUndefined();
        });

        it("should return a functional error", async () => {
            expect.assertions(2);

            nock(UniknameConfig.devnet.url)
                .post("/safetypo/")
                .reply(400);

            const result: Response<SafeTypoResult> = await client.safetypo.analyze("b0b");
            expect(result.error).not.toBeUndefined();
            expect(result.data).toBeUndefined();
        });

        it("should throw an exception", async () => {
            expect.assertions(1);

            nock(UniknameConfig.devnet.url)
                .post("/safetypo/")
                .reply(500);

            await expect(client.safetypo.analyze("b0b")).rejects.toThrowError("Internal Server Error");
        });

        it("should broadcast exception", async () => {
            expect.assertions(1);

            nock(UniknameConfig.devnet.url)
                .post("/safetypo/")
                .reply(200, () => {
                    throw new Error("this is a custom error");
                });

            await expect(client.safetypo.analyze("b0b")).rejects.toThrowError("this is a custom error");
        });
    });

    describe("unik-name-fingerprint", () => {
        beforeEach(() => {
            nock.cleanAll();
        });

        it("should return a fingerprint", async () => {
            expect.assertions(2);

            const response = {
                data: { fingerprint: "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77" },
            };

            nock(UniknameConfig.devnet.url)
                .post("/unik-name-fingerprint/")
                .reply(200, response);

            const result = await client.fingerprint.compute("myUnikName", "INDIVIDUAL");
            expect(result.data).toStrictEqual(response.data);
            expect(result.error).toBeUndefined();
        });

        it("should return a functional error", async () => {
            expect.assertions(2);

            nock(UniknameConfig.devnet.url)
                .post("/unik-name-fingerprint/")
                .reply(400);

            const result: Response<FingerprintResult> = await client.fingerprint.compute("toto", "INDIVIDUAL");
            expect(result.error).not.toBeUndefined();
            expect(result.data).toBeUndefined();
        });

        it("should throw an exception on 500 http code", async () => {
            expect.assertions(1);

            nock(UniknameConfig.devnet.url)
                .post("/unik-name-fingerprint/")
                .reply(500);

            await expect(client.fingerprint.compute("toto", "INDIVIDUAL")).rejects.toThrowError(
                "Internal Server Error",
            );
        });

        it("should broadcast exception", async () => {
            expect.assertions(1);

            nock(UniknameConfig.devnet.url)
                .post("/unik-name-fingerprint/")
                .reply(200, () => {
                    throw new Error("this is a custom error");
                });

            await expect(client.fingerprint.compute("toto", "INDIVIDUAL")).rejects.toThrowError(
                "this is a custom error",
            );
        });
    });
});

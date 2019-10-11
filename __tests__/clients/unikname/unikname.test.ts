import nock = require("nock");
import { parameters, unikid, discloseDemandCertification, safetypoResponse, fingerprintResponse } from "./__fixtures__";
import {
    UniknameClient,
    SafeTypoResult,
    Response,
    UniknameConfig,
    FingerprintResult,
    DiscloseDemandCertification,
} from "../../../src";

describe("UniknameClient", () => {
    const client = new UniknameClient();

    const mock = nock(UniknameConfig.devnet.url);

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
        beforeEach(() => {
            nock.cleanAll();
        });

        const safetypoMock = mock.post("/safetypo/");

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
        beforeEach(() => {
            nock.cleanAll();
        });

        const fingerprintMock = mock.post("/unik-name-fingerprint/");

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

    describe("unik", () => {
        const unikMock = id => mock.post(`/uniks/${id}/disclose-demand-certification`);

        it("should return a DiscloseDemandCertification", async () => {
            expect.assertions(1);

            unikMock(unikid).reply(200, discloseDemandCertification);

            const certification = await client.unik.discloseDemandCertification(parameters);
            expect(certification).toStrictEqual(discloseDemandCertification);
        });

        it("should return a functional error", async () => {
            expect.assertions(2);

            unikMock(unikid).reply(400);

            const result: Response<DiscloseDemandCertification> = await client.unik.discloseDemandCertification(
                parameters,
            );
            expect(result.error).not.toBeUndefined();
            expect(result.data).toBeUndefined();
        });

        it("should throw an exception on 500 http code", async () => {
            expect.assertions(1);

            unikMock(unikid).reply(500);

            await expect(client.unik.discloseDemandCertification(parameters)).rejects.toThrowError(
                "Internal Server Error",
            );
        });

        it("should broadcast exception", async () => {
            expect.assertions(1);

            unikMock(unikid).reply(200, () => {
                throw new Error("this is a custom error");
            });

            await expect(client.unik.discloseDemandCertification(parameters)).rejects.toThrowError(
                "this is a custom error",
            );
        });
    });
});

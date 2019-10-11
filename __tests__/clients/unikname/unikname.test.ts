import nock = require("nock");
import { SafeTypoResult, Response, FingerprintResult, UNSClient, UNSConfig, Network } from "../../../src";
import { parameters, unikid, discloseDemandCertification, safetypoResponse, fingerprintResponse } from "./__fixtures__";
import { DiscloseDemandCertification } from "../../../src/clients/repositories";

describe("UNSClient", () => {
    const client = new UNSClient(Network.devnet);

    const mock = nock(UNSConfig.devnet.service.url);

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

    describe("discloseDemandCertification", () => {
        const discloseDemandCertificationMock = () => mock.post(`/disclose-demand-certification/`);

        it("should return a DiscloseDemandCertification", async () => {
            expect.assertions(1);

            discloseDemandCertificationMock().reply(200, discloseDemandCertification);

            const certification = await client.discloseDemandCertification.discloseDemandCertification(parameters);
            expect(certification).toStrictEqual(discloseDemandCertification);
        });

        it("should return a functional error", async () => {
            expect.assertions(2);

            discloseDemandCertificationMock().reply(400);

            const result: Response<DiscloseDemandCertification> = await client.discloseDemandCertification.discloseDemandCertification(
                parameters,
            );
            expect(result.error).not.toBeUndefined();
            expect(result.data).toBeUndefined();
        });

        it("should throw an exception on 500 http code", async () => {
            expect.assertions(1);

            discloseDemandCertificationMock().reply(500);

            await expect(client.discloseDemandCertification.discloseDemandCertification(parameters)).rejects.toThrowError(
                "Internal Server Error",
            );
        });

        it("should broadcast exception", async () => {
            expect.assertions(1);

            discloseDemandCertificationMock().reply(200, () => {
                throw new Error("this is a custom error");
            });

            await expect(client.discloseDemandCertification.discloseDemandCertification(parameters)).rejects.toThrowError(
                "this is a custom error",
            );
        });
    });
});

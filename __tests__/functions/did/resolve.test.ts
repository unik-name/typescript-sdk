import { DidResolution, didResolve, ResolutionResult } from "../../../src";
import { NETWORK } from "../__fixtures__/tests-commons";
import {
    META,
    mockFingerprintRequest,
    mockPropertyRequest,
    mockSafetypoRequest,
    mockTransactionRequest,
    RESOLVED_UNIK_TOKEN,
    UNIK_TOKEN,
    WALLET_ADDRESS,
} from "./__fixtures__/resolve";
import nock = require("nock");
import { mockUnikRequest } from "../__mocks__/mocks";

describe("DID Resolver", () => {
    beforeEach(() => {
        nock.cleanAll();
        mockSafetypoRequest();
        mockFingerprintRequest();
        mockUnikRequest(UNIK_TOKEN.data!.id, UNIK_TOKEN.data, UNIK_TOKEN.chainmeta);
        mockTransactionRequest();
    });

    it("should return UNIK token informations", async () => {
        const resolved = await didResolve("@unik:individual:myUnikName", NETWORK);
        expect(resolved).toEqual(RESOLVED_UNIK_TOKEN);
    });

    it("should return UNIK token wallet owner id id", async () => {
        const resolved = await didResolve("@unik:individual:myUnikName?*", NETWORK);
        expect(resolved).toEqual({ data: WALLET_ADDRESS, chainmeta: META, confirmations: 20 });
    });

    it("should return UNIK token type property value", async () => {
        mockUnikRequest(UNIK_TOKEN.data!.id, UNIK_TOKEN.data, UNIK_TOKEN.chainmeta);
        mockPropertyRequest();
        mockTransactionRequest();
        const resolved = await didResolve("@unik:individual:myUnikName?type", NETWORK);
        expect((resolved as DidResolution<ResolutionResult>).data?.type).toEqual("1");
    });
});

import { didResolve, DidResolution } from "../../../src";
import nock = require("nock");
import {
    mockSafetypoRequest,
    mockFingerprintRequest,
    mockUnikRequest,
    mockTransactionRequest,
    mockPropertyRequest,
    META,
    WALLET_ADDRESS,
    RESOLVED_UNIK_TOKEN,
} from "./__fixtures__/resolve";

describe("DID Resolver", () => {
    beforeEach(() => {
        nock.cleanAll();
        mockSafetypoRequest();
        mockFingerprintRequest();
        mockUnikRequest();
        mockTransactionRequest();
    });

    it("should return UNIK token", async () => {
        const resolved = await didResolve("@unik:individual/myUnikName");
        expect(resolved).toEqual(RESOLVED_UNIK_TOKEN);
    });

    it("should return UNIK token wallet owner id id", async () => {
        const resolved = await didResolve("@unik:individual/myUnikName?*");
        expect(resolved).toEqual({ data: WALLET_ADDRESS, chainmeta: META, confirmations: 20 });
    });

    it("should return UNIK token type property value", async () => {
        mockPropertyRequest();
        const resolved = await didResolve("@unik:individual/myUnikName?type");
        expect((resolved as DidResolution<string>).data).toEqual("1");
    });
});

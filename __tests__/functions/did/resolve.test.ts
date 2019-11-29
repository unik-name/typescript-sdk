import { DidResolution, didResolve } from "../../../src";
import { NETWORK } from "../__fixtures__/tests-commons";
import {
    META,
    mockFingerprintRequest,
    mockPropertyRequest,
    mockSafetypoRequest,
    mockTransactionRequest,
    mockUnikRequest,
    RESOLVED_UNIK_TOKEN,
    WALLET_ADDRESS,
} from "./__fixtures__/resolve";
import nock = require("nock");

describe("DID Resolver", () => {
    beforeEach(() => {
        nock.cleanAll();
        mockSafetypoRequest();
        mockFingerprintRequest();
        mockUnikRequest();
        mockTransactionRequest();
    });

    it("should return UNIK token", async () => {
        const resolved = await didResolve("@unik:individual:myUnikName", NETWORK);
        expect(resolved).toEqual(RESOLVED_UNIK_TOKEN);
    });

    it("should return UNIK token wallet owner id id", async () => {
        const resolved = await didResolve("@unik:individual:myUnikName?*", NETWORK);
        expect(resolved).toEqual({ data: WALLET_ADDRESS, chainmeta: META, confirmations: 20 });
    });

    it("should return UNIK token type property value", async () => {
        mockPropertyRequest();
        const resolved = await didResolve("@unik:individual:myUnikName?type", NETWORK);
        expect((resolved as DidResolution<string>).data).toEqual("1");
    });
});

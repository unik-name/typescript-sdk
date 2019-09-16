import { DIDHelpers, DIDType, DIDTypes } from "../../src";

describe("DID types", () => {
    it("should be exported", () => {
        expect(DIDTypes).toBeDefined();
        expect(DIDHelpers.labels).toBeDefined();
        expect(DIDHelpers.codes).toBeDefined();
        expect(DIDHelpers.fromLabel).toBeDefined();
        expect(DIDHelpers.fromCode).toBeDefined();
        const t: DIDType = DIDHelpers.fromCode(DIDTypes.INDIVIDUAL);
        expect(t).toBe("INDIVIDUAL");
    });
});

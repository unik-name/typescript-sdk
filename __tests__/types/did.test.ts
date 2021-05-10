import { DIDHelpers, DIDType, DIDTypes } from "../../src";

describe("DID types", () => {
    it("should be exported", () => {
        expect(DIDTypes).toBeDefined();
        expect(DIDHelpers.labels).toBeDefined();
        expect(DIDHelpers.codes).toBeDefined();
        expect(DIDHelpers.fromLabel).toBeDefined();
        expect(DIDHelpers.fromCode).toBeDefined();
        expect(DIDHelpers.parseType).toBeDefined();
        expect(DIDHelpers.isDIDType).toBeDefined();
    });

    describe("DIDHelpers.fromCode", () => {
        it("Should get label from code", () => {
            const t: DIDType | undefined = DIDHelpers.fromCode(DIDTypes.INDIVIDUAL);
            expect(t).toBe("INDIVIDUAL");
        });
    });

    describe("DIDHelpers.isDIDType", () => {
        it("Should be valid from number", () => {
            expect(DIDHelpers.isDIDType(1)).toBe(true);
            expect(DIDHelpers.isDIDType(2)).toBe(true);
            expect(DIDHelpers.isDIDType(3)).toBe(true);
        });
        it("Should be invalid from number", () => {
            expect(DIDHelpers.isDIDType(-1)).toBe(false);
            expect(DIDHelpers.isDIDType(20909)).toBe(false);
            expect(DIDHelpers.isDIDType(11000)).toBe(false);
        });

        it("Should be valid from string", () => {
            expect(DIDHelpers.isDIDType("individual")).toBe(true);
            expect(DIDHelpers.isDIDType("INDIVIDUAL")).toBe(true);
            expect(DIDHelpers.isDIDType("INDiVIDuAL")).toBe(true);
            expect(DIDHelpers.isDIDType("organization")).toBe(true);
            expect(DIDHelpers.isDIDType("ORGANIZATION")).toBe(true);
            expect(DIDHelpers.isDIDType("ORGaNIZATiON")).toBe(true);
            expect(DIDHelpers.isDIDType("network")).toBe(true);
            expect(DIDHelpers.isDIDType("NETWORK")).toBe(true);
            expect(DIDHelpers.isDIDType("netWorK")).toBe(true);
        });

        it("Should be invalid from string", () => {
            expect(DIDHelpers.isDIDType("foo")).toBe(false);
            expect(DIDHelpers.isDIDType("bar")).toBe(false);
            expect(DIDHelpers.isDIDType("2")).toBe(false);
            expect(DIDHelpers.isDIDType("-1")).toBe(false);
        });
    });
    describe("DIDHelpers.parseType", () => {
        it("Should be valid from number", () => {
            expect(DIDHelpers.parseType(1)).toBe(DIDTypes.INDIVIDUAL);
            expect(DIDHelpers.parseType(2)).toBe(DIDTypes.ORGANIZATION);
            expect(DIDHelpers.parseType(3)).toBe(DIDTypes.NETWORK);
        });
        it("Should be invalid from number", () => {
            expect(DIDHelpers.parseType(-1)).toBeUndefined();
            expect(DIDHelpers.parseType(20909)).toBeUndefined();
            expect(DIDHelpers.parseType(11000)).toBeUndefined();
        });

        it("Should be valid from string", () => {
            expect(DIDHelpers.parseType("individual")).toBe(DIDTypes.INDIVIDUAL);
            expect(DIDHelpers.parseType("INDIVIDUAL")).toBe(DIDTypes.INDIVIDUAL);
            expect(DIDHelpers.parseType("INDiVIDuAL")).toBe(DIDTypes.INDIVIDUAL);
            expect(DIDHelpers.parseType("organization")).toBe(DIDTypes.ORGANIZATION);
            expect(DIDHelpers.parseType("ORGANIZATION")).toBe(DIDTypes.ORGANIZATION);
            expect(DIDHelpers.parseType("ORGaNIZATiON")).toBe(DIDTypes.ORGANIZATION);
            expect(DIDHelpers.parseType("network")).toBe(DIDTypes.NETWORK);
            expect(DIDHelpers.parseType("NETWORK")).toBe(DIDTypes.NETWORK);
            expect(DIDHelpers.parseType("netWorK")).toBe(DIDTypes.NETWORK);
        });

        it("Should be invalid from string", () => {
            expect(DIDHelpers.parseType("foo")).toBeUndefined();
            expect(DIDHelpers.parseType("bar")).toBeUndefined();
            expect(DIDHelpers.parseType("2")).toBeUndefined();
            expect(DIDHelpers.parseType("-1")).toBeUndefined();
        });
    });
});

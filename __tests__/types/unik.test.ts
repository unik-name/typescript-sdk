import { UNIKTypes } from "../../src";

describe("UNIK types", () => {
    it("should be exported", () => {
        expect(UNIKTypes.CORPORATE).toBeDefined();
        expect(UNIKTypes.INDIVIDUAL).toBeDefined();
    });
});

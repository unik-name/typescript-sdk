import { buildDiscloseDemand } from "../../src";
import { DIDTypes } from "../../src/types";
import { getCurrentIAT } from "../../src/utils";

describe("Functions > disclose", () => {
    describe("buildDiscloseDemand", () => {
        it("should built a DiscloseDemand", () => {
            const unikid = "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77";
            const explicitValues = ["explicit1", "explicit2"];
            const type = DIDTypes.INDIVIDUAL;
            const passphrase = "passphrase";

            const demand = buildDiscloseDemand(unikid, explicitValues, type, passphrase);

            const { signature, payload } = demand;

            expect(payload.explicitValue).toStrictEqual(explicitValues);
            expect(payload.type).toStrictEqual(type);
            expect(payload.iss).toStrictEqual(unikid);
            expect(payload.sub).toStrictEqual(unikid);
            expect(getCurrentIAT()).toBeGreaterThan(payload.iat);

            expect(signature.length).toBeGreaterThan(64); // sha256
            // we do not verify signature content, maybe later.
        });
    });
});

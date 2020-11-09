import { escapeSlashes } from "../src/clients/repositories/unik/utils";
import { merge } from "../src/utils";

describe("Utilities", () => {
    describe("merge", () => {
        it("should allow null parameters", () => {
            expect(merge({ a: 1 }, {})).toStrictEqual({ a: 1 });
            expect(merge({}, { b: 2 })).toStrictEqual({ b: 2 });
        });
    });

    describe("escapeSlashes", () => {
        it("without slash", () => {
            const prop: string = "myPropertyWithoutSlash";
            expect(escapeSlashes(prop)).toEqual(prop);
        });
        it("with one slash", () => {
            const prop: string = "myPropertyWithOne/Slash";
            expect(escapeSlashes(prop)).toEqual("myPropertyWithOne%2FSlash");
        });

        it("with several slashes", () => {
            const prop: string = "my/Property//With////Several/Slashes/";
            expect(escapeSlashes(prop)).toEqual("my%2FProperty%2F%2FWith%2F%2F%2F%2FSeveral%2FSlashes%2F");
        });
    });
});

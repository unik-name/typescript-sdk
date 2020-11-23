import { unsFormat } from "../src/utils/numbers";
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

    describe("uns Formater", () => {
        it("<1", () => {
            expect(unsFormat("12345", "PATATES")).toStrictEqual("<1 PATATES");
        });
        it("<1000 no decimals", () => {
            expect(unsFormat("200000000")).toStrictEqual("2");
        });
        it("<1000 1 decimals", () => {
            expect(unsFormat("220000000")).toStrictEqual("2.2");
        });
        it("<1000 2 decimals", () => {
            expect(unsFormat("222000000")).toStrictEqual("2.22");
        });
        it("<1000 3 decimals", () => {
            expect(unsFormat("222200000")).toStrictEqual("2.2~");
        });
        it("empty", () => {
            expect(unsFormat("")).toStrictEqual(undefined);
        });
        it("zero", () => {
            expect(unsFormat("0")).toStrictEqual("0");
        });
        it(">1000 no decimals", () => {
            expect(unsFormat("200022200000")).toStrictEqual("2k");
        });
        it(">1000 2 decimals", () => {
            expect(unsFormat("212000000000")).toStrictEqual("2.12k");
        });
        it(">1000 tilde", () => {
            expect(unsFormat("222200000000")).toStrictEqual("2.2~k");
        });
        it(">1000000 no decimals", () => {
            expect(unsFormat("200000022200000")).toStrictEqual("2M");
        });
        it(">1000000 2 decimals", () => {
            expect(unsFormat("212000000000000")).toStrictEqual("2.12M");
        });
        it(">1000000 tilde", () => {
            expect(unsFormat("212300000000000")).toStrictEqual("2.1~M");
        });
    });
});

import { merge, join } from "../src/utils";

describe("Utilities", () => {
    describe("merge", () => {
        it("should allow null parameters", () => {
            expect(merge({ a: 1 }, null)).toStrictEqual({ a: 1 });
            expect(merge(null, { b: 2 })).toStrictEqual({ b: 2 });
        });
    });

    describe("join", () => {
        it("should join with '/'", () => {
            expect(join("hello", "world")).toStrictEqual("hello/world");
        });

        it("should join empty strings", () => {
            expect(join("a", "b", "c", "", "")).toStrictEqual("a/b/c//");
        });
    });
});

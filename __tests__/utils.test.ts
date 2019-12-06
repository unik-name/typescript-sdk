import { merge, join, computeRequestUrl } from "../src/utils";

describe("Utilities", () => {
    describe("merge", () => {
        it("should allow null parameters", () => {
            expect(merge({ a: 1 }, {})).toStrictEqual({ a: 1 });
            expect(merge({}, { b: 2 })).toStrictEqual({ b: 2 });
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

    describe("computeRequestUrl", () => {
        const baseUrl = "http://myUrl.com";
        it("empty path with query", () => {
            const query = "limit=1";
            expect(computeRequestUrl(baseUrl, "", query)).toEqual(`${baseUrl}?${query}`);
        });
        it("empty path without query", () => {
            expect(computeRequestUrl(baseUrl, "")).toEqual(`${baseUrl}`);
        });
        it("path with query", () => {
            const path = "myPath";
            const query = "limit=1";
            expect(computeRequestUrl(baseUrl, path, query)).toEqual(`${baseUrl}/${path}?${query}`);
        });
        it("path without query", () => {
            const path = "myPath";
            expect(computeRequestUrl(baseUrl, path)).toEqual(`${baseUrl}/${path}`);
        });
    });
});

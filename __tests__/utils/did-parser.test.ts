import { parse } from "../../src/utils/did-parser/did-parser";
import { DidParserError } from "../../src/utils/did-parser/errors/did-parser-error";
import { shouldPass } from "./__fixtures__/did-parse-success";
import { shouldFail } from "./__fixtures__/did-parse-fail";
import { DidParserResult } from "../../src/utils/did-parser/did-parser-result";

describe("DID Parser", () => {
    describe("Fails: ", () => {
        shouldFail.forEach(fail => {
            it(fail.did, async () => {
                const parseResult: DidParserResult | DidParserError = await parse(fail.did);
                expect((parseResult as DidParserError).message).toEqual(fail.message);
            });
        });
    });

    describe("Successes: ", () => {
        shouldPass.forEach(success => {
            it(success.did, async () => {
                const parseResult: DidParserResult | DidParserError = await parse(success.did);
                expect(parseResult).toEqual(success.result);
            });
        });
    });
});

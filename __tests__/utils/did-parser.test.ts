import { parse } from "../../src/utils/did-parser/did-parser";
import { DidParserError } from "../../src/utils/did-parser/errors/did-parser-error";
import { shouldPass } from "./__fixtures__/did-parse-success";
import { shouldFail } from "./__fixtures__/did-parse-fail";
import { DidParserResult } from "../../src/utils/did-parser/did-parser-result";

describe("DID Parser", () => {
    shouldFail.forEach(fail => {
        it(`Pattern matching should fail for ${fail.did}`, async () => {
            const parseResult: DidParserResult | DidParserError = await parse(fail.did);
            expect((parseResult as DidParserError).message).toEqual(fail.message);
        });
    });
    shouldPass.forEach(success => {
        it(`Pattern matching should pass for ${success.did}`, async () => {
            const parseResult: DidParserResult | DidParserError = await parse(success.did);
            expect(parseResult).toBeInstanceOf(DidParserResult);
            expect(parseResult).toEqual(success.result);
        });
    });
});

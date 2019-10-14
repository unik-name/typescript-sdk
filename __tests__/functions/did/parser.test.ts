import { parse, UNSClient, Network } from "../../../src";
import { DidParserError } from "../../../src";
import { shouldPass } from "./__fixtures__/parse-success";
import { shouldFail } from "./__fixtures__/parse-fail";
import { DidParserResult } from "../../../src";

// TODO: these tests are testing safetypo webservice when we want to test `parse` function.
// It must be re-worked
describe.skip("DID Parser", () => {
    const client = new UNSClient(Network.devnet);
    describe("Fails: ", () => {
        shouldFail.forEach(fail => {
            it(fail.did, async () => {
                const parseResult: DidParserResult | DidParserError = await parse(fail.did, client);
                expect((parseResult as DidParserError).message).toEqual(fail.message);
            });
        });
    });

    describe("Successes: ", () => {
        shouldPass.forEach(success => {
            it(success.did, async () => {
                const parseResult: DidParserResult | DidParserError = await parse(success.did, client);
                expect(parseResult).toEqual(success.result);
            });
        });
    });
});

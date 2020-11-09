import { DidParserError, DidParserResult, Network, parse, UNSClient, DEFAULT_UNS_CONFIG } from "../../../src";
import { shouldFail } from "./__fixtures__/parse-fail";
import { shouldPass } from "./__fixtures__/parse-success";
import nock = require("nock");

// TODO: these tests are testing safetypo webservice when we want to test `parse` function.
// It must be re-worked
describe("DID Parser", () => {
    const client = new UNSClient();
    client.init({ network: Network.sandbox });

    describe("Fails: ", () => {
        shouldFail.forEach(fail => {
            it(fail.did, async () => {
                const parseResult: DidParserResult | DidParserError = await parse(fail.did, client);
                expect((parseResult as DidParserError).message).toEqual(fail.message);
            });
        });
    });

    describe("Successes: ", () => {
        beforeEach(() => {
            // We only mock safetypo, we don't test safetypo result here, just parser
            nock(DEFAULT_UNS_CONFIG.endpoints.sandbox.services)
                .post("/safetypo")
                .reply(200, { data: {} });
        });
        shouldPass.forEach(success => {
            it(success.did, async () => {
                const parseResult: DidParserResult | DidParserError = await parse(success.did, client);
                expect(parseResult).toEqual(success.result);
            });
        });
    });
});

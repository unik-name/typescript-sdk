import nock = require("nock");
import {
    UNSClient,
    Network,
    ResponseWithChainMeta,
    PropertyValue,
    USER_PROPERTY_PREFIX,
    BADGES_PREFIX,
    DEFAULT_UNS_CONFIG,
} from "../../../src";
import { ACTIVE_BADGES_REGEXP, ACTIVE_SYSTEM_PROPERTIES } from "../../../src/clients/repositories/unik/constants";
import { properties, unikid } from "./../__fixtures__";

describe("Unik repository tests", () => {
    const client = new UNSClient();
    client.init({ network: Network.sandbox });
    const mock = nock(DEFAULT_UNS_CONFIG.endpoints.sandbox.network);

    describe("properties", () => {
        const propsMock = mock.get(`/uniks/${unikid}/properties`);

        it("should discard non active badges", async () => {
            propsMock.reply(200, {
                data: properties,
            });

            const response: ResponseWithChainMeta<{ [_: string]: PropertyValue }[]> = await client.unik.properties(
                unikid,
            );

            response.data?.forEach(prop => {
                const key = Object.getOwnPropertyNames(prop)[0];
                if (key.startsWith(BADGES_PREFIX)) {
                    expect(ACTIVE_BADGES_REGEXP.some(e => e.test(key))).toBeTruthy();
                } else if (!key.startsWith(USER_PROPERTY_PREFIX)) {
                    expect(ACTIVE_SYSTEM_PROPERTIES.includes(key)).toBeTruthy();
                }
            });
            expect.assertions(10);
        });
    });
});

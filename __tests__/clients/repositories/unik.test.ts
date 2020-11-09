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
import { ACTIVE_BADGES, ACTIVE_SYSTEM_PROPERTIES } from "../../../src/clients/repositories/unik/constants";
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
                    expect(ACTIVE_BADGES.some(e => new RegExp(key).test(BADGES_PREFIX + e))).toBeTruthy();
                } else if (!key.startsWith(USER_PROPERTY_PREFIX)) {
                    expect(ACTIVE_SYSTEM_PROPERTIES.includes(key)).toBeTruthy();
                }
            });
            expect.assertions(ACTIVE_BADGES.length + ACTIVE_SYSTEM_PROPERTIES.length);
        });
    });
});

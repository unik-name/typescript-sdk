import nock = require("nock");
import { UNSClient } from "../../../src";
import { NodeStatus } from "../../../src/clients/uns/resources";

describe("UNSClient", () => {
    const client = new UNSClient();

    describe("node", () => {
        beforeEach(() => {
            nock.cleanAll();
        });

        it("status should return a valid NodeStatus object", async () => {
            expect.assertions(1);

            const response = {
                data: {
                    synced: true,
                    now: 157201,
                    blocksCount: -157201,
                },
            };
            nock("https://forger1.devnet.uns.network/api/v2")
                .get("/node/status")
                .reply(200, response);

            const nodeStatus: NodeStatus = await client.node.status();
            expect(nodeStatus).toStrictEqual(response.data);
        });
    });
});

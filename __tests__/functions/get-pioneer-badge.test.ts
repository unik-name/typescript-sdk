import { getCurrentPioneerBadge, PioneerBadgeGrades, UNSClient } from "../../src";
import * as utils from "../../src/utils";
import { NETWORK } from "./__fixtures__/tests-commons";
import { mockNftStatus } from "./__fixtures__/get-property-value";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const mockCurrentTime = (mockTime: string) => {
    jest.spyOn(utils, "getUTCTime").mockImplementation(time => {
        if (time === "2021-01-01") {
            return dayjs.utc(time);
        } else {
            return dayjs.utc(mockTime);
        }
    });
};
const unsClient = new UNSClient();
unsClient.init({ network: NETWORK });

describe("Functions > getCurrentPioneerBadge", () => {
    describe("Pioneer badge", () => {
        it("should get Innovator badge before 2021", async () => {
            const date = "2019-12-24";
            mockCurrentTime(date);
            const badgeVal = await getCurrentPioneerBadge(unsClient);
            expect(badgeVal).toStrictEqual(PioneerBadgeGrades.INNOVATOR.toString());
        });

        it("should get Early adopter badge after 2021", async () => {
            mockNftStatus({
                nftName: "UNIK",
                individual: "320",
                organization: "40",
                network: "12",
            });

            const date = "2032-12-24";
            mockCurrentTime(date);
            const badgeVal = await getCurrentPioneerBadge(unsClient);
            expect(badgeVal).toStrictEqual(PioneerBadgeGrades.EARLY_ADOPTER.toString());
        });

        it("should get no Pioneer badge when nbUniks > 150.000 after 2020", async () => {
            mockNftStatus({
                nftName: "UNIK",
                individual: "50001",
                organization: "50000",
                network: "50000",
            });

            const date = "2024-12-24";
            mockCurrentTime(date);
            const badgeVal = await getCurrentPioneerBadge(unsClient);
            expect(badgeVal).toBeUndefined();
        });
    });
});

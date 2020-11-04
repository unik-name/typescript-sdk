import { INftStatus, ResponseWithChainMeta, UNSClient } from "../clients";
import { PIONEER_EARLY_ADOPTER_LIMIT, PioneerBadgeGrades } from "../types";
import { getUTCTime } from "../utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export async function getCurrentPioneerBadge(client: UNSClient): Promise<string | undefined> {
    if (getUTCTime().isBefore(getUTCTime("2021-01-01"))) {
        return PioneerBadgeGrades.INNOVATOR.toString();
    }
    const nftStatus: ResponseWithChainMeta<INftStatus[]> = await client.nft.status();
    const nbUniks = nftStatus.data?.find(status => status.nftName === "UNIK");

    if (nbUniks) {
        const totalUniks = parseInt(nbUniks.individual) + parseInt(nbUniks.organization) + parseInt(nbUniks.network);
        if (totalUniks <= PIONEER_EARLY_ADOPTER_LIMIT) {
            return PioneerBadgeGrades.EARLY_ADOPTER.toString();
        }
    }
    return;
}

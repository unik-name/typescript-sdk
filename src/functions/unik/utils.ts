import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function getUTCTime(time?: string) {
    return dayjs.utc(time);
}

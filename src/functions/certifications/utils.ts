import dayjs from "dayjs";

export function getCurrentIAT() {
    return dayjs().unix();
}

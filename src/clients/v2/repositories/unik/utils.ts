import { ACTIVE_BADGES, ACTIVE_SYSTEM_PROPERTIES } from "./constants";
import { UnikProperty } from "./types";

const isActiveBadge = (key: string): boolean => ACTIVE_BADGES.includes(key);

const isActiveSystemProperty = (key: string): boolean => ACTIVE_SYSTEM_PROPERTIES.includes(key);

export const isActiveProperty = (property: UnikProperty): boolean => {
    const key = Object.getOwnPropertyNames(property)[0];
    return isActiveBadge(key) || isActiveSystemProperty(key);
};

export function escapeSlashes(toEscape: string): string {
    return toEscape.replace(/\//g, "%2F");
}

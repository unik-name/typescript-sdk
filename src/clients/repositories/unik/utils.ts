import { USER_PROPERTY_PREFIX, VERIFIED_URL_KEY_PREFIX } from "../../../functions/unik/constants";
import { ACTIVE_BADGES, ACTIVE_SYSTEM_PROPERTIES } from "./constants";
import { UnikProperty } from "./types";

const isActiveBadge = (key: string): boolean => ACTIVE_BADGES.includes(key);

const isActiveSystemProperty = (key: string): boolean => ACTIVE_SYSTEM_PROPERTIES.includes(key);

const isUserProperty = (key: string): boolean => key.startsWith(USER_PROPERTY_PREFIX);

const isVerifiedUrl = (key: string): boolean => key.startsWith(VERIFIED_URL_KEY_PREFIX);

export const isActiveProperty = (property: UnikProperty): boolean => {
    const key = Object.getOwnPropertyNames(property)[0];
    return isUserProperty(key) || isVerifiedUrl(key) || isActiveBadge(key) || isActiveSystemProperty(key);
};

export const escapeSlashes = (toEscape: string): string => toEscape.replace(/\//g, "%2F");

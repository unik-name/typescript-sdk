export const BADGES_PREFIX = "Badges/";

/* Pioneer */
export const BADGE_PIONEER_KEY = `${BADGES_PREFIX}Pioneer$`;
export const BADGE_PIONEER_KEY_REGEXP = new RegExp(`^${BADGE_PIONEER_KEY}$`);
export enum PioneerBadgeGrades {
    INNOVATOR = 1,
    EARLY_ADOPTER = 2,
}
/* Pioneer badge grades for number of uniks on chain*/
export const PIONEER_EARLY_ADOPTER_LIMIT = 150000;

/* XP Level */
export const BADGE_XP_LEVEL_KEY = `${BADGES_PREFIX}XPLevel`;
export const BADGE_XP_LEVEL_KEY_REGEXP = new RegExp(`^${BADGE_XP_LEVEL_KEY}$`);
export enum XPLevelBadgeGrades {
    NEWCOMER = 1,
    BEGINNER = 2,
    ADVANCED = 3,
    LEADER = 4,
    MAVEN = 5,
}

/* NP/Delegate */
export const BADGE_DELEGATE_KEY = `${BADGES_PREFIX}NP/Delegate`;
export const BADGE_DELEGATE_KEY_REGEXP = new RegExp(`^${BADGE_DELEGATE_KEY}$`);

/* Second passphrase */
export const BADGE_SECOND_PASSPHRASE_KEY = `${BADGES_PREFIX}Security/SecondPassphrase`;
export const BADGE_SECOND_PASSPHRASE_KEY_REGEXP = new RegExp(`^${BADGE_SECOND_PASSPHRASE_KEY}$`);

/* Special properties */
export const VERIFIED_URL_KEY_PREFIX = "Verified/URL/";

export const USER_PROPERTY_PREFIX: string = "usr/";

export { UNS_NFT_PROPERTY_KEY_REGEX, LIFE_CYCLE_PROPERTY_KEY, LifeCycleGrades } from "@uns/crypto";

/* Authentications */
export const AUTHENTICATIONS_PREFIX: string = "Authentications/";

export const AUTHENTICATIONS_COSMIC_NONCE: string = `${AUTHENTICATIONS_PREFIX}CosmicNonce`;

/* Events */
export const BADGE_EVENTS_PREFIX = `${BADGES_PREFIX}Event/`;
export const BADGE_EVENTS_PREFIX_REGEXP = new RegExp(`^${BADGE_EVENTS_PREFIX}`);

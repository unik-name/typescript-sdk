import { BADGES_PREFIX } from "../clients/repositories";
////////////
/* Badges */
////////////

/* Pioneer */
export const BADGE_PIONEER_KEY = `${BADGES_PREFIX}Pioneer`;
export enum PioneerBadgeGrades {
    INNOVATOR = 1,
    EARLY_ADOPTER = 2,
}
/* Pioneer badge grades for number of uniks on chain*/
export const PIONEER_INNOVATOR = 1500;
export const PIONEER_EARLY_ADOPTER = 150000;

/* XP Level */
export const BADGE_XP_LEVEL_KEY = "Badges/XPLevel";

/* Special properties */
export const VERIFIED_URL_KEY_PREFIX = "Verified/URL/";

/* LifeCycle */
export const LIFE_CYCLE_PROPERTY_KEY = "LifeCycle/Status";
export enum LifeCycleGrades {
    ISSUED = 1,
    MINTED = 2,
    LIVE = 3,
    ABORTED = 4,
    EVERLASTING = 100,
}

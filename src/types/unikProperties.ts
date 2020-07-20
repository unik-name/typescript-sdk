import { BADGES_PREFIX } from "../../src/clients/repositories";

/* Badges */
export const BADGE_PIONEER_KEY = `${BADGES_PREFIX}Pioneer`;
export enum PioneerBadgeGrades {
    INNOVATOR = 1,
    EARLY_ADOPTER = 2,
}

/* Pioneer badge grades for number of uniks on chain*/
export const PIONEER_INNOVATOR = 1500;
export const PIONEER_EARLY_ADOPTER = 150000;

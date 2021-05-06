import { Delegate, DIDTypes } from "../..";

export type DelegateWithState = Delegate & { active: boolean };
export type ExplicitByUnikIdMap = Record<string, string>;

export type UniknameDelegate = Omit<Delegate, "type"> & {
    explicit: string;
    unikId: string;
    type: DIDTypes;
    active: boolean;
};

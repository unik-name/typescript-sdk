import {
    HTTPClient,
    nodeConfiguration,
    delegatesAll,
    delegatesGet,
    roundsGetDelegates,
    DIDTypes,
    DIDHelpers,
    unikSearch,
    Delegate,
    getCurrentHeight,
    roundFromHeightAndDelegates,
} from "../..";
import { unikGet, walletGet } from "../../clients";
import { DelegateWithState, ExplicitByUnikIdMap, UniknameDelegate } from "./types";

const getNumberOfActiveDelegates = async (http: HTTPClient): Promise<number> =>
    nodeConfiguration(http)().then(r => r.data!.constants!.activeDelegates!);

/**
 * Get list of delegates (without unikname properties)
 */
const getRegisteredDelegates = async (http: HTTPClient): Promise<Delegate[]> => {
    const allDelegates = await delegatesAll(http)().then(r => r.data!);
    const allRegisteredDelegates = allDelegates.filter(d => !d.isResigned);
    return allRegisteredDelegates;
};

/**
 * Get list of public keys of current round delegates
 */
const getActiveDelegatesPubKey = async (http: HTTPClient): Promise<string[]> => {
    const height = await getCurrentHeight(http);
    const activeDelegates = await getNumberOfActiveDelegates(http);
    const currentRound = roundFromHeightAndDelegates(height, activeDelegates);
    return roundsGetDelegates(http)(currentRound).then(r => r.data!.map(d => d.publicKey));
};

/**
 * Returns a map <unikId,explicit>
 */
const buildExplicitByUnikIdMap = (unikIds: string[], http: HTTPClient): Promise<ExplicitByUnikIdMap> =>
    unikSearch(http)(unikIds)
        .then(r => r.data!)
        .then(uniks =>
            uniks.reduce<ExplicitByUnikIdMap>((map, { id, defaultExplicitValue }) => {
                map[id] = defaultExplicitValue!;
                return map;
            }, {}),
        );

/**
 * Enrich raw delegate objects with their unikname properties
 */
const buildUniknameDelegates = async (
    delegates: DelegateWithState[],
    http: HTTPClient,
): Promise<UniknameDelegate[]> => {
    // Fetch all explicits (to save bandwidth)
    const unikIds = delegates.map(d => d.username);
    // Could be removed if delegate API returns explicit directly (like if does for type or unikId)
    const explicitByUnikIdMap = await buildExplicitByUnikIdMap(unikIds, http);

    return delegates.map(delegate => {
        const { username, type } = delegate;
        const didType = DIDHelpers.parseType(type);
        if (!didType) {
            throw new Error(`delegate (${username}) has invalid type (${type})`);
        }
        const unikId = username;
        return { ...delegate, unikId, type: didType, explicit: explicitByUnikIdMap[unikId] };
    });
};

/**
 * Enrich raw delegate object with its unikname properties
 */
const buildUniknameDelegate = (delegate: DelegateWithState, http: HTTPClient): Promise<UniknameDelegate> =>
    buildUniknameDelegates([delegate], http).then(r => r[0]);

/**
 * Get a all registered delegates (active and standby)
 */
export const getUniknameDelegates = (http: HTTPClient, expectedType?: DIDTypes): Promise<UniknameDelegate[]> =>
    // 1. Fetch active delegate list and all registered delegates
    Promise.all([getActiveDelegatesPubKey(http), getRegisteredDelegates(http)])
        .then(([activeDelegatesPubKey, registeredDelegates]) =>
            registeredDelegates
                // 2. Filter if required by delegate type
                .filter(({ type }) => (expectedType ? DIDHelpers.parseType(type) === expectedType : true))
                // 3. Set active state
                .map(
                    (delegate: Delegate): DelegateWithState => ({
                        ...delegate,
                        active: activeDelegatesPubKey.includes(delegate.publicKey),
                    }),
                ),
        )
        .then(delegates => buildUniknameDelegates(delegates, http));

/**
 * Get a delegate from its id (username)
 */
export const getUniknameDelegate = (delegateUsername: string, http: HTTPClient): Promise<UniknameDelegate> =>
    Promise.all([getActiveDelegatesPubKey(http), delegatesGet(http)(delegateUsername).then(r => r.data!)])
        .then(([activeDelegatesPubKey, delegate]) => ({
            ...delegate,
            active: activeDelegatesPubKey.includes(delegate.publicKey),
        }))
        .then(delegate => buildUniknameDelegate(delegate, http));

/**
 * Get current voted delegate (with unikname properties) of given unikname
 */
export const getCurrentVote = async (unikId: string, http: HTTPClient): Promise<UniknameDelegate | undefined> => {
    const ownerId = await unikGet(http)(unikId).then(r => r.data!.ownerId!);
    const voteDelegateUsername = await walletGet(http)(ownerId).then(
        r => r.data!.attributes?.vote as string | undefined,
    );
    if (!voteDelegateUsername) {
        return undefined;
    }
    return getUniknameDelegate(voteDelegateUsername, http);
};

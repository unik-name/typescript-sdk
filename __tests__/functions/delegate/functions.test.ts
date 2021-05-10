import { DIDHelpers, DIDTypes, getCurrentVote, getUniknameDelegate, getUniknameDelegates } from "../../../src";
import { UNS_CLIENT_FOR_TESTS } from "../__fixtures__/tests-commons";
import {
    activeIndividualDelegates,
    delegates,
    individualDelegates,
    nodeConfig,
    nodeStatus,
    organizationDelegates,
    registeredDelegates,
    resignedDelegates,
    roundsDelegates,
    uniks,
    uniksMap,
    voter,
} from "./__fixtures__";
import {
    mockDelegate,
    mockDelegates,
    mockNodeConfig,
    mockNodeStatus,
    mockRoundDelegates,
    mockUnik,
    mockUnikSearch,
    mockWallet,
} from "./__mocks__";

describe("Delegate functions", () => {
    const http = UNS_CLIENT_FOR_TESTS.http;

    describe("get unikname delegates", () => {
        beforeEach(() => {
            mockNodeStatus(nodeStatus());
            mockNodeConfig(nodeConfig());
            mockRoundDelegates(300, roundsDelegates);
            mockDelegates(delegates);
            mockUnikSearch(uniks);
        });

        it("Should return all registered delegates", async () => {
            const gotDelegates = await getUniknameDelegates(http);
            // all registered delegates are in the returned value
            // and unikid is delegate username
            expect(gotDelegates.map(d => d.unikId)).toStrictEqual(registeredDelegates.map(d => d.username));
            // explicit is returned by unik search endpoint
            expect(gotDelegates.every(({ explicit, unikId }) => explicit === uniksMap[unikId])).toBe(true);
            // all active delegates are in the rounds delegate endpoint result
            expect(gotDelegates.filter(d => d.active).map(({ publicKey }) => ({ publicKey }))).toStrictEqual(
                roundsDelegates,
            );
        });

        it("Should return registered delegates of type", async () => {
            const delegates = await getUniknameDelegates(http, DIDTypes.INDIVIDUAL);
            // result contains only individual delegates
            expect(delegates.map(d => d.unikId)).toStrictEqual(individualDelegates.map(d => d.username));
            // result contains active and standby delegates
            expect(delegates.filter(d => d.active).length).toBe(4);
            // every delegate has individual type
            expect(delegates.map(d => d.type).every(t => t === DIDTypes.INDIVIDUAL)).toBe(true);
        });
    });
    describe("get unikname delegate", () => {
        beforeEach(() => {
            mockNodeStatus(nodeStatus());
            mockNodeConfig(nodeConfig());
            mockRoundDelegates(300, roundsDelegates);
            mockUnikSearch(uniks);
        });

        it("Should return active delegate unikname", async () => {
            const delegate = individualDelegates[0];
            mockDelegate(delegate.username, delegate);
            const unikname = await getUniknameDelegate(delegate.username, http);
            expect(unikname.active).toBe(true);
            expect(unikname.type).toBe(DIDHelpers.parseType(delegate.type));
            expect(unikname.explicit).toBe(uniksMap[unikname.unikId]);
        });

        it("Should return standby delegate unikname", async () => {
            const delegate = organizationDelegates[organizationDelegates.length - 1];
            mockDelegate(delegate.username, delegate);
            const unikname = await getUniknameDelegate(delegate.username, http);
            expect(unikname.active).toBe(false);
        });

        it("Should return resigned delegate unikname", async () => {
            const delegate = resignedDelegates[0];
            mockDelegate(delegate.username, delegate);
            const unikname = await getUniknameDelegate(delegate.username, http);
            expect(unikname.active).toBe(false);
        });
    });

    describe("get current vote", () => {
        beforeEach(() => {
            mockNodeStatus(nodeStatus());
            mockNodeConfig(nodeConfig());
            mockRoundDelegates(300, roundsDelegates);
            mockUnikSearch(uniks);
        });

        it("Should return current vote", async () => {
            const delegate = activeIndividualDelegates[0];
            mockDelegate(delegate.username, delegate);
            const voterInfo = voter(delegate.username);
            mockUnik(voterInfo.unik.id, voterInfo.unik);
            mockWallet(voterInfo.wallet.address, voterInfo.wallet);

            const unikname = await getCurrentVote(voterInfo.unik.id, http);
            expect(unikname).toBeDefined();
            expect(unikname!.active).toBe(true);
            expect(unikname!.type).toBe(DIDTypes.INDIVIDUAL);
        });

        it("Should return undefined when no voter", async () => {
            const voterInfo = voter();
            delete voterInfo.wallet.attributes;
            mockUnik(voterInfo.unik.id, voterInfo.unik);
            mockWallet(voterInfo.wallet.address, voterInfo.wallet);
            const unikname = await getCurrentVote(voterInfo.unik.id, http);
            expect(unikname).toBeUndefined();
        });

        it("Should throw if delegate api returns invalid type", () => {
            const delegate = activeIndividualDelegates[0];
            delegate.type = "invalidType";
            mockDelegate(delegate.username, delegate);
            const voterInfo = voter(delegate.username);
            mockUnik(voterInfo.unik.id, voterInfo.unik);
            mockWallet(voterInfo.wallet.address, voterInfo.wallet);
            return expect(getCurrentVote(voterInfo.unik.id, http)).rejects.toThrowError(/invalid\ type/);
        });
    });
});

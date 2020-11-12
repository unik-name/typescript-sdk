import { LifeCycleGrades, throwIfNotAllowedToVote, UNSClient } from "../../src";
import { mockWalletTokens, NETWORK } from "./__fixtures__/tests-commons";
import * as functions from "../../src/functions/unik";

const unsClient = new UNSClient();
unsClient.init({ network: NETWORK });
const unikid = "deadbeef41c3bd14cb6dc19cbb70166f217a9a3dbbdd518c51bb91560c775450";

describe("Functions > vote > throwIfNotAllowedToVote", () => {
    it("should not throw for wallet address input", async () => {
        jest.spyOn(functions, "getPropertyValue").mockResolvedValueOnce(LifeCycleGrades.LIVE.toString());
        const walletAddress = "walletaddress";
        mockWalletTokens(walletAddress, [{ id: unikid, ownerId: "owner" }]);
        expect(await throwIfNotAllowedToVote(unsClient, walletAddress)).toBeUndefined();
    });

    it("should throw for wallet with no unik", async () => {
        const walletAddress = "walletaddress";
        mockWalletTokens(walletAddress, []);
        await expect(throwIfNotAllowedToVote(unsClient, walletAddress)).rejects.toThrow(
            "Cryptoaccount has no @unikname.",
        );
    });

    it("should not throw for LIVE", async () => {
        jest.spyOn(functions, "getPropertyValue").mockResolvedValueOnce(LifeCycleGrades.LIVE.toString());
        expect(await throwIfNotAllowedToVote(unsClient, unikid)).toBeUndefined();
    });

    it("should not throw for EVERLASTING", async () => {
        jest.spyOn(functions, "getPropertyValue").mockResolvedValueOnce(LifeCycleGrades.EVERLASTING.toString());
        expect(await throwIfNotAllowedToVote(unsClient, unikid)).toBeUndefined();
    });

    it("should throw for MINTED", async () => {
        jest.spyOn(functions, "getPropertyValue").mockResolvedValueOnce(LifeCycleGrades.MINTED.toString());
        await expect(throwIfNotAllowedToVote(unsClient, unikid)).rejects.toThrow(
            '@unikname of cryptoaccount has to be alive or everlasting ("LifeCycle/Status" = 3 or 100) to vote.',
        );
    });
});

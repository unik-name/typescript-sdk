import {
    createCertifiedNftMintTransaction,
    DIDScript,
    DIDTypes,
    NftFactoryServicesList,
    Unik,
    UNSClient,
    UNSLengthGroup,
    isError,
    LifeCycleGrades,
    LIFE_CYCLE_PROPERTY_KEY,
    BADGE_XP_LEVEL_KEY,
    XPLevelBadgeGrades,
} from "../../src";
import { NETWORK } from "./__fixtures__/tests-commons";
import { mockUnikPattern, mockServiceSearch, mockMintCertification, mockUnikRequest } from "./__mocks__/mocks";
import { ITransactionData } from "@uns/ark-crypto/dist/interfaces";
import { Managers } from "@uns/ark-crypto";
import { mockSafetypoRequest } from "./did/__fixtures__/resolve";

const unsClient = new UNSClient();
unsClient.init({ network: NETWORK });

const unikid = "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77";
const passphrase = "passphrase";
const issUnikId = "issuerUnik";
const issAddress = "DQLiVPs2b6rHYCANjVk7vWVfQqdo5rLvDU";
const fee = 321;
const explicitValues = "TheExplicitValue";
const cost = 54321;
const jwtSignature = "mNaF-RscD89ab9RO5qksLVZl7alVXCVkTT8fUeTO-Ac3qTYVIroPmnc0Q-OZRaCA6rE6CYnkf0eVpT4BduJBGw";
const voucher = `eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1OTg0MzQ4MTMsImV4cCI6MTU5ODY5NDAxMywianRpIjoiU3lqZkV0ZUE4dFNBUFJqVjRiX2x3IiwiYXVkIjoiZGlkOnVuaWs6dW5pZDpkZWFkYmVlZjcwMDIxNDI1NTU4ZjVjYmI3YjVmMDU2ZTUxYjY5NGRiNWNjNmMzMzZhYmRjNmI3NzdmYzlkMDUxIiwic3ViIjoiZGlkOnVuaWs6dW5pZDpkZWFkYmVlZjcwMDIxNDI1NTU4ZjVjYmI3YjVmMDU2ZTUxYjY5NGRiNWNjNmMzMzZhYmRjNmI3NzdmYzlkMDUxIiwidHlwZSI6InVybCIsInZhbHVlIjoidG90by5sb2wiLCJpc3MiOiJkaWQ6dW5pazp1bmlkOjVmOTZkZDM1OWFiMzAwZTJjNzAyYTU0NzYwZjRkNzRhMTFkYjA3NmFhMTc1NzUxNzlkMzZlMDZkNzVjOTY1MTEifQ.${jwtSignature}`;

describe("Functions > certified mint", () => {
    beforeEach(() => {
        // force tokenomics v2
        jest.spyOn(Managers.configManager, "getMilestone").mockReturnValue({ unsTokenEcoV2: true, aip11: true });

        mockSafetypoRequest();
        mockUnikPattern({ lengthGroup: UNSLengthGroup.LATIN_NORMAL, script: DIDScript.LATIN });
        mockServiceSearch({ id: NftFactoryServicesList.NFT_FACTORY_MINT_INDIVIDUAL_LATIN_SAFE_TYPO_3 });
        mockMintCertification({
            payload: {
                iss: issUnikId,
                sub: "c73c49fbee6c2bde99ce489a0bb14ff79a4fb4de1d217dae337a808372a487a7",
                iat: 123456,
                cost: cost.toString(),
            },
            signature:
                "304502210086ad4f670bc9b719768cacabc451bdfd481b00dde6773235d9917205f25c42ae022044c815578ae8cd76e638167e446f04a71bf53983f21c91fe774c07cac65288e6",
        });
        mockUnikRequest(issUnikId, { ownerId: issAddress } as Unik);
    });
    describe("createCertifiedNftMintTransaction with voucher", () => {
        it("should create mint transaction for individual", async () => {
            const didType = DIDTypes.INDIVIDUAL;
            const did = `@unik:${didType}:${explicitValues}`;
            const transaction = await createCertifiedNftMintTransaction(
                unsClient,
                unikid,
                did,
                fee,
                "1",
                passphrase,
                undefined,
                voucher,
            );

            expect(isError(transaction)).toBeFalsy();
            expect((transaction as ITransactionData)?.asset?.nft.unik.properties).toStrictEqual({
                [BADGE_XP_LEVEL_KEY]: XPLevelBadgeGrades.NEWCOMER.toString(),
                [LIFE_CYCLE_PROPERTY_KEY]: LifeCycleGrades.MINTED.toString(),
                UnikVoucherId: "SyjfEteA8tSAPRjV4b_lw",
                type: didType.toString(),
            });
            expect((transaction as ITransactionData)?.fee.toString()).toStrictEqual("0");
            expect((transaction as ITransactionData)?.amount.toString()).toStrictEqual(cost.toString());
        });

        it("should create mint transaction for organization", async () => {
            const didType = DIDTypes.ORGANIZATION;
            const did = `@unik:${didType}:${explicitValues}`;
            const transaction = await createCertifiedNftMintTransaction(
                unsClient,
                unikid,
                did,
                fee,
                "1",
                passphrase,
                undefined,
                voucher,
            );

            expect(isError(transaction)).toBeFalsy();
            expect((transaction as ITransactionData)?.asset?.nft.unik.properties).toStrictEqual({
                [LIFE_CYCLE_PROPERTY_KEY]: LifeCycleGrades.LIVE.toString(),
                UnikVoucherId: "SyjfEteA8tSAPRjV4b_lw",
                type: didType.toString(),
            });
            expect((transaction as ITransactionData)?.fee.toString()).toStrictEqual(fee.toString());
            expect((transaction as ITransactionData)?.amount.toString()).toStrictEqual(cost.toString());
        });
    });
    describe("createCertifiedNftMintTransaction", () => {
        it("should create mint transaction for individual", async () => {
            const didType = DIDTypes.INDIVIDUAL;
            const did = `@unik:${didType}:${explicitValues}`;
            const transaction = await createCertifiedNftMintTransaction(unsClient, unikid, did, fee, "1", passphrase);

            expect(isError(transaction)).toBeFalsy();
            expect((transaction as ITransactionData)?.asset?.nft.unik.properties).toStrictEqual({
                [BADGE_XP_LEVEL_KEY]: XPLevelBadgeGrades.NEWCOMER.toString(),
                [LIFE_CYCLE_PROPERTY_KEY]: LifeCycleGrades.MINTED.toString(),
                type: didType.toString(),
            });
            expect((transaction as ITransactionData)?.fee.toString()).toStrictEqual(fee.toString());
            expect((transaction as ITransactionData)?.amount.toString()).toStrictEqual(cost.toString());
        });

        it("should create mint transaction for organization", async () => {
            const didType = DIDTypes.ORGANIZATION;
            const did = `@unik:${didType}:${explicitValues}`;
            const transaction = await createCertifiedNftMintTransaction(unsClient, unikid, did, fee, "1", passphrase);

            expect(isError(transaction)).toBeFalsy();
            expect((transaction as ITransactionData)?.asset?.nft.unik.properties).toStrictEqual({
                [LIFE_CYCLE_PROPERTY_KEY]: LifeCycleGrades.MINTED.toString(),
                type: didType.toString(),
            });
            expect((transaction as ITransactionData)?.fee.toString()).toStrictEqual(fee.toString());
            expect((transaction as ITransactionData)?.amount.toString()).toStrictEqual(cost.toString());
        });
    });
});

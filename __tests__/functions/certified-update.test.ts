import { Unik, UNSClient, isError, createCertifiedNftUpdateTransaction } from "../../src";
import { NETWORK } from "./__fixtures__/tests-commons";
import { mockUnikRequest, mockUpdateCertification } from "./__mocks__/mocks";
import { ITransactionData } from "@uns/ark-crypto/dist/interfaces";
import { Managers } from "@uns/ark-crypto";

const unsClient = new UNSClient();
unsClient.init({ network: NETWORK });
const unikid = "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77";
const passphrase = "passphrase";
const issUnikId = "issuerUnik";
const issAddress = "DQLiVPs2b6rHYCANjVk7vWVfQqdo5rLvDU";
const fee = 321;
const cost = 54321;

describe("Functions > certified update", () => {
    beforeEach(() => {
        // force tokenomics v2
        jest.spyOn(Managers.configManager, "getMilestone").mockReturnValue({ aip11: true });
        mockUnikRequest(issUnikId, { ownerId: issAddress } as Unik);
        mockUpdateCertification({
            payload: {
                iss: issUnikId,
                sub: "c73c49fbee6c2bde99ce489a0bb14ff79a4fb4de1d217dae337a808372a487a7",
                iat: 123456,
                cost: cost.toString(),
            },
            signature:
                "304502210086ad4f670bc9b719768cacabc451bdfd481b00dde6773235d9917205f25c42ae022044c815578ae8cd76e638167e446f04a71bf53983f21c91fe774c07cac65288e6",
        });
    });

    describe("createCertifiedNftUpdateTransaction", () => {
        it("should create update transaction", async () => {
            const properties = { "usr/tata": "titi" };
            const transaction = await createCertifiedNftUpdateTransaction(
                unsClient,
                unikid,
                properties,
                fee,
                "1",
                passphrase,
            );

            expect(isError(transaction)).toBeFalsy();
            expect((transaction as ITransactionData)?.asset?.nft.unik.properties).toStrictEqual(properties);
            expect((transaction as ITransactionData)?.fee.toString()).toStrictEqual(fee.toString());
            expect((transaction as ITransactionData)?.amount.toString()).toStrictEqual(cost.toString());
        });
    });
});

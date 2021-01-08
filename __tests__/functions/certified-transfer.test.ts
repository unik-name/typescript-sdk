import {
    UNSClient,
    isError,
    createCertifiedNftTransferTransaction,
    UnikTransferCertifiedTransactionBuildOptions,
    DIDTypes,
} from "../../src";
import { NETWORK } from "./__fixtures__/tests-commons";
import { mockUnikPropery, mockTransferCertification } from "./__mocks__/mocks";
import { ITransactionData } from "@uns/ark-crypto/dist/interfaces";

const unsClient = new UNSClient();
unsClient.init({ network: NETWORK });
const unikId = "a242daa994cc5490020871731d34f7cd3c3993e0b30bac1233d7483001e96e77";
const passphrase = "passphrase";
const issUnikId = "issuerUnik";
const recipientAddress = "D9cH5Jr1gNHUTFrAi8MHmgXVPPHy31bXff";
const fees = 321;
const cost = 54321;

describe("Functions > certified transfer", () => {
    beforeEach(() => {
        mockUnikPropery(unikId, "type", DIDTypes.INDIVIDUAL.toString());
        mockTransferCertification({
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

    describe("createCertifiedNftTransferTransaction", () => {
        it("should create transfer transaction", async () => {
            const properties = { "usr/tata": "titi" };
            const options: UnikTransferCertifiedTransactionBuildOptions = {
                httpClient: unsClient.http,
                unikId,
                recipientAddress,
                fees,
                nonce: "1",
                passphrase,
                properties,
            };
            const transaction = await createCertifiedNftTransferTransaction(options);

            expect(isError(transaction)).toBeFalsy();
            expect((transaction as ITransactionData)?.asset?.nft.unik.properties).toStrictEqual(properties);
            expect((transaction as ITransactionData)?.asset?.demand.payload.cryptoAccountAddress).toStrictEqual(
                recipientAddress,
            );
            expect((transaction as ITransactionData)?.asset?.certification.payload.cost).toStrictEqual(cost.toString());
            expect((transaction as ITransactionData)?.fee.toString()).toStrictEqual(fees.toString());
        });
    });
});

import {
    mockTransactionRequest,
    mockPropertyRequest,
    UNIK_FINGERPRINT,
    META,
    resolvedUnikToken,
} from "./__fixtures__/get-property-value";
import { ResponseWithChainMeta, PropertyValue, getPropertyValue, UNSClient } from "../../src";
import { NETWORK } from "./__fixtures__/tests-commons";
import { mockUnikRequest } from "./__mocks__/mocks";

describe("Functions > getPropertyValue", () => {
    const unsclient = new UNSClient();
    unsclient.init({ network: NETWORK });
    beforeEach(() => {
        mockTransactionRequest();
        mockUnikRequest(resolvedUnikToken.data!.id, resolvedUnikToken.data);
    });

    it("Should return type property value", async () => {
        const propertyKey = "type";
        mockPropertyRequest(propertyKey, 1);
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, unsclient);
        expect(value).toEqual(1);
    });

    it("Should return type property value and chainmeta", async () => {
        const propertyKey = "type";
        mockPropertyRequest(propertyKey, "1");
        const value: ResponseWithChainMeta<PropertyValue> | PropertyValue = await getPropertyValue(
            UNIK_FINGERPRINT,
            propertyKey,
            unsclient,
            {
                withChainmeta: true,
            },
        );
        expect((value as ResponseWithChainMeta<PropertyValue>).data).toEqual("1");
        expect((value as ResponseWithChainMeta<PropertyValue>).chainmeta).toEqual(META);
    });

    it("Should return unescaped property with spaces", async () => {
        const propertyKey = "myPropertyKey";
        mockPropertyRequest(propertyKey, "my property value");
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, unsclient);
        expect(value).toEqual("my property value");
    });

    it("Should return escaped property with spaces", async () => {
        const propertyKey = "myPropertyKey";
        mockPropertyRequest(propertyKey, "my property value");
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, unsclient, { disableHtmlEscape: true });
        expect(value).toEqual("my%20property%20value");
    });

    it("Should return unescaped property with html tags", async () => {
        const propertyKey = "myPropertyKey";
        mockPropertyRequest(propertyKey, "my property value<br/><br>");
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, unsclient);
        expect(value).toEqual("my property value<br/><br>");
    });

    it("Should return escaped property with html tags", async () => {
        const propertyKey = "myPropertyKey";
        mockPropertyRequest(propertyKey, "my property value<br/><br>");
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, unsclient, { disableHtmlEscape: true });
        expect(value).toEqual("my%20property%20value%3Cbr/%3E%3Cbr%3E");
    });
});

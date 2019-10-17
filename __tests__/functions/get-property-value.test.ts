import {
    mockTransactionRequest,
    mockUnikRequest,
    mockPropertyRequest,
    UNIK_FINGERPRINT,
    META,
    NETWORK,
} from "./__fixtures__/get-property-value";
import { ResponseWithChainMeta, PropertyValue, getPropertyValue } from "../../src";

describe("Functions > getPropertyValue", () => {
    beforeEach(() => {
        mockTransactionRequest();
        mockUnikRequest();
    });

    it("Should return type property value", async () => {
        const propertyKey = "type";
        mockPropertyRequest(propertyKey, 1);
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, NETWORK);
        expect(value).toEqual(1);
    });

    it("Should return type property value and chainmeta", async () => {
        const propertyKey = "type";
        mockPropertyRequest(propertyKey, "1");
        const value: ResponseWithChainMeta<PropertyValue> | PropertyValue = await getPropertyValue(
            UNIK_FINGERPRINT,
            propertyKey,
            NETWORK,
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
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, NETWORK);
        expect(value).toEqual("my property value");
    });

    it("Should return escaped property with spaces", async () => {
        const propertyKey = "myPropertyKey";
        mockPropertyRequest(propertyKey, "my property value");
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, NETWORK, { disableHtmlEscape: true });
        expect(value).toEqual("my%20property%20value");
    });

    it("Should return unescaped property with html tags", async () => {
        const propertyKey = "myPropertyKey";
        mockPropertyRequest(propertyKey, "my property value<br/><br>");
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, NETWORK);
        expect(value).toEqual("my property value<br/><br>");
    });

    it("Should return escaped property with html tags", async () => {
        const propertyKey = "myPropertyKey";
        mockPropertyRequest(propertyKey, "my property value<br/><br>");
        const value = await getPropertyValue(UNIK_FINGERPRINT, propertyKey, NETWORK, { disableHtmlEscape: true });
        expect(value).toEqual("my%20property%20value%3Cbr/%3E%3Cbr%3E");
    });
});

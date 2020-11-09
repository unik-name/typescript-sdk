import { DIDTypes } from "../../../functions/did/types";

export type UnikVoucherRequestBody = {
    explicitValue: string;
    didType: DIDTypes;
    coupon?: string;
    paymentProof?: string;
};

export type UnikVoucherResult = {
    unikVoucher: string;
};

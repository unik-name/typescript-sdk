import { DIDTypes } from "../../../../did";

export type UnikVoucherRequestBody = {
    explicitValue: string;
    didType: DIDTypes;
    coupon?: string;
    paymentProof?: string;
};

export type UnikVoucherResult = {
    unikVoucher: string;
};

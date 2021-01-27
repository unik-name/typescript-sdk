import { DIDTypes } from "../../../functions/did/types";

export type UnikVoucherRequestBody = {
    explicitValue: string;
    didType: DIDTypes;
    coupon?: string;
    paymentProof?: string;
    orderId?: string; // OrderId used for unik reservation
};

export type UnikVoucherResult = {
    unikVoucher: string;
};

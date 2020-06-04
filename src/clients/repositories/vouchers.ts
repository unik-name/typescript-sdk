import { Response } from "../response";
import { DIDTypes } from "@uns/crypto";
import { ServiceRepository } from "./types/ServiceRepository";

export const VOUCHER_REPOSITORY_SUB: string = "unik-vouchers";

export type UnikVoucherRequestBody = {
    explicitValue: string;
    didType: DIDTypes;
    coupon?: string;
    paymentProof?: string;
};

export type UnikVoucherResult = {
    unikVoucher: string;
};

export class UnikVoucherRepository extends ServiceRepository {
    public async create(parameters: UnikVoucherRequestBody): Promise<Response<UnikVoucherResult>> {
        return this.withHttpErrorsHandling<UnikVoucherResult>(() => this.POST<Response<UnikVoucherResult>>(parameters));
    }

    protected sub(): string {
        return VOUCHER_REPOSITORY_SUB;
    }
}

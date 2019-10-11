import { Repository } from "../../repository";
import { Response } from "../../response";
import { HTTPError } from "ky-universal";
import { DIDType } from "../../..";

export const UnikRepositorySub: string = "uniks";

type JWT = {
    sub: string;
    iss: string;
    iat: number;
};

export type DiscloseDemandPayload = JWT & {
    explicitValue: string[];
    type: DIDType;
};

export type DiscloseDemand = {
    payload: DiscloseDemandPayload;
    signature: string;
};

export type DiscloseDemandCertification = {
    payload: JWT;
    signature: string;
};

export class UnikRepository extends Repository {
    public async discloseDemandCertification(
        parameters: DiscloseDemand,
    ): Promise<Response<DiscloseDemandCertification>> {
        try {
            const response = await this.POST<Response<DiscloseDemandCertification>>(
                { ...parameters },
                `${parameters.payload.sub}/disclose-demand-certification`,
            );
            return response;
        } catch (error) {
            if (error instanceof HTTPError && error.response.status === 400) {
                return { error };
            } else {
                throw error;
            }
        }
    }

    protected sub(): string {
        return UnikRepositorySub;
    }
}

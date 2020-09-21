import { Response } from "../response";
import { ServiceRepository } from "./types/ServiceRepository";
import { DIDScript, DIDTypes, NftFactoryServicesList, UNSLengthGroup, UNSServiceType } from "../../types";
import { UnikPattern } from "./unikPattern";

export const NETWORK_UNIT_SERVICES_REPOSITORY_SUB: string = "network-unit-services";

export type NetworkUnitService = {
    id: NftFactoryServicesList;
    description: string;
    cost: number;
    type: UNSServiceType;
};

export type NetworkUnitMintService = NetworkUnitService & {
    script: DIDScript;
    didType: DIDTypes;
    lengthRange?: { id: UNSLengthGroup; min: number; max?: number };
};

export type SearchNetworkUnitServiceRequest = UnikPattern & {
    transaction: UNSServiceType;
};

export type SearchNetworkUnitMintServiceRequest = {
    dtype?: DIDTypes;
};

export class NetworkUnitServicesRepository extends ServiceRepository {
    public async search(parameters: SearchNetworkUnitServiceRequest): Promise<Response<NetworkUnitService>> {
        return this.withHttpErrorsHandling<NetworkUnitService>(() =>
            this.POST<Response<NetworkUnitService>>(parameters, "search"),
        );
    }

    public getMintServices({
        dtype,
    }: SearchNetworkUnitMintServiceRequest): Promise<Response<NetworkUnitMintService[]>> {
        return this.withHttpErrorsHandling<NetworkUnitMintService[]>(() =>
            this.GET<Response<NetworkUnitMintService[]>>(
                "mint",
                new URLSearchParams([["dtype", `${dtype}`]]).toString(),
            ),
        );
    }

    protected sub(): string {
        return NETWORK_UNIT_SERVICES_REPOSITORY_SUB;
    }
}

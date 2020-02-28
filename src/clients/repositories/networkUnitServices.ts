import { Response } from "../response";
import { ServiceRepository } from "./types/ServiceRepository";
import { NftFactoryServicesList, UNSServiceType } from "../../types";
import { UnikPattern } from "./unikPattern";

export const NETWORK_UNIT_SERVICES_REPOSITORY_SUB: string = "network-unit-services";

export type NetworkUnitService = {
    id: NftFactoryServicesList;
    description: string;
};

export type SearchNetworkUnitServiceRequest = UnikPattern & {
    transaction: UNSServiceType;
};

export class NetworkUnitServicesRepository extends ServiceRepository {
    public async search(parameters: SearchNetworkUnitServiceRequest): Promise<Response<NetworkUnitService>> {
        return this.withHttpErrorsHandling<NetworkUnitService>(() =>
            this.POST<Response<NetworkUnitService>>(parameters, "search"),
        );
    }

    protected sub(): string {
        return NETWORK_UNIT_SERVICES_REPOSITORY_SUB;
    }
}

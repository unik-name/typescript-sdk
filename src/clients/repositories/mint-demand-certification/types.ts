import { INftDemand } from "@uns/crypto";
import { NftFactoryServicesList } from "../network-unit-services/constants";

export interface CertificationRequestBody<T extends INftDemand> {
    demand: T;
    unikname?: string; // DID
    serviceId?: NftFactoryServicesList;
    unikVoucher?: string;
}

import { INftDemand } from "@uns/crypto";
import { NftFactoryServicesList } from "../network-unit-services/constants";

export interface CertificationRequestBody<T extends INftDemand> {
    demand: T;
    unikname?: string; // DID
    serviceId?: NftFactoryServicesList;
    unikVoucher?: string;
    jwtProof?: string; // Proof from IDP used for UNIK activation
    orderId?: string; // OrderId used for unik reservation
}

export {
    INftDemand,
    INftMintDemandCertification,
    INftMintDemand,
    INftMintDemandPayload,
    NftMintDemandSigner,
} from "@uns/crypto";

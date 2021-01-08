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
    INftDemandCertification as INftMintDemandCertification,
    INftDemand as INftMintDemand,
    INftDemandPayload as INftMintDemandPayload,
    NftDemandSigner as NftMintDemandSigner,
} from "@uns/crypto";

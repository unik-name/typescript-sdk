import { UNSConfig, UNSEndpointConfig } from "./config";
import { HTTPClient } from "./http/client";
import {
    fingerprintCompute,
    discloseDemandCertificationCreate,
    blockchainGet,
    blockLast,
    networkUnikServicesGetMintServices,
    networkUnitServicesSearch,
    unikGet,
    unikPatternCompute,
    unikProperties,
    unikProperty,
    unikSearch,
    unikTotalCount,
    nftsStatus,
    mintDemandCertificationCreate,
    updateDemandCertificationCreate,
    nodeStatus,
    nodeConfiguration,
    nodeConfigurationCrypto,
    safetypoAnalyze,
    transactionsGet,
    transactionsSearch,
    transactionsSend,
    transactionsUnconfirmed,
    voucherCreate,
    walletGet,
    walletTokens,
} from ".";

export class UNSClient {
    private http: HTTPClient;

    constructor(config?: UNSConfig) {
        this.http = new HTTPClient(config);
    }

    public get configuration(): UNSConfig {
        return this.http.config;
    }

    public get currentEndpointsConfig(): UNSEndpointConfig {
        return this.http.config.endpoints;
    }

    public get fingerprint() {
        return {
            compute: fingerprintCompute(this.http),
        };
    }

    public get unik() {
        return {
            get: unikGet(this.http),
            getUniks: unikSearch(this.http),
            totalCount: unikTotalCount(this.http),
            property: unikProperty(this.http),
            properties: unikProperties(this.http),
        };
    }

    public get block() {
        return {
            last: blockLast(this.http),
        };
    }

    public get blockchain() {
        return {
            get: blockchainGet(this.http),
        };
    }

    public get discloseDemandCertification() {
        return {
            create: discloseDemandCertificationCreate(this.http),
        };
    }

    public get networkUnitServices() {
        return {
            search: networkUnitServicesSearch(this.http),
            getMintServices: networkUnikServicesGetMintServices(this.http),
        };
    }

    public get unikPattern() {
        return {
            compute: unikPatternCompute(this.http),
        };
    }

    public get nft() {
        return {
            status: nftsStatus,
        };
    }

    public get mintDemandCertification() {
        return {
            create: mintDemandCertificationCreate(this.http),
        };
    }

    public get updateDemandCertification() {
        return {
            create: updateDemandCertificationCreate(this.http),
        };
    }

    public get node() {
        return {
            status: nodeStatus(this.http),
            configuration: nodeConfiguration(this.http),
            configurationCrypto: nodeConfigurationCrypto(this.http),
        };
    }

    public get safetypo() {
        return {
            analyze: safetypoAnalyze(this.http),
        };
    }

    public get transactions() {
        return {
            get: transactionsGet(this.http),
            send: transactionsSend(this.http),
            search: transactionsSearch(this.http),
            unconfirmed: transactionsUnconfirmed(this.http),
        };
    }

    public get vouchers() {
        return {
            create: voucherCreate(this.http),
        };
    }

    public get wallet() {
        return {
            get: walletGet(this.http),
            tokens: walletTokens(this.http),
        };
    }
}

import { DEFAULT_CLIENT_CONFIG, EndpointsConfig, UNSClientConfig, UNSConfig } from "../config";
import {
    BLOCKCHAIN_REPOSITORY_SUB,
    DiscloseDemandCertificationRepository,
    DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB,
    FingerprintRepository,
    FINGERPRINT_REPOSITORY_SUB,
    NodeRepository,
    NODE_REPOSITORY_SUB,
    SafetypoRepository,
    SAFETYPO_REPOSITORY_SUB,
    TransactionRepository,
    TRANSACTION_REPOSITORY_SUB,
    UnikRepository,
    UNIK_REPOSITORY_SUB,
    NFT_REPOSITORY_SUB,
    NftRepository,
} from "./repositories";
import { BlockchainRepository } from "./repositories/blockchain";
import { WalletRepository, WALLET_REPOSITORY_SUB } from "./repositories/wallet";
import { Repository } from "./repository";

export class UNSClient {
    public repositories: Record<string, Repository> = {};

    private config: UNSClientConfig = DEFAULT_CLIENT_CONFIG;

    private endpointsConfig: EndpointsConfig = UNSClient.computeCurrentEndpointsConfig(DEFAULT_CLIENT_CONFIG);

    public init(config: UNSClientConfig): UNSClient {
        this.config = config;
        this.endpointsConfig = UNSClient.computeCurrentEndpointsConfig(config);
        this.initRepositories();
        return this;
    }

    public get configuration(): UNSClientConfig {
        return this.config;
    }

    public get currentEndpointsConfig(): EndpointsConfig {
        return this.endpointsConfig;
    }

    private getResource<T extends Repository>(name: string): T {
        return this.repositories[name] as T;
    }

    public get node(): NodeRepository {
        return this.getResource<NodeRepository>(NODE_REPOSITORY_SUB);
    }

    public get transaction(): TransactionRepository {
        return this.getResource<TransactionRepository>(TRANSACTION_REPOSITORY_SUB);
    }

    public get unik(): UnikRepository {
        return this.getResource<UnikRepository>(UNIK_REPOSITORY_SUB);
    }

    public get nft(): NftRepository {
        return this.getResource<NftRepository>(NFT_REPOSITORY_SUB);
    }

    public get wallet(): WalletRepository {
        return this.getResource<WalletRepository>(WALLET_REPOSITORY_SUB);
    }

    public get fingerprint(): FingerprintRepository {
        return this.getResource<FingerprintRepository>(FINGERPRINT_REPOSITORY_SUB);
    }

    public get safetypo(): SafetypoRepository {
        return this.getResource<SafetypoRepository>(SAFETYPO_REPOSITORY_SUB);
    }

    public get discloseDemandCertification(): DiscloseDemandCertificationRepository {
        return this.getResource<DiscloseDemandCertificationRepository>(DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB);
    }

    public get blockchain(): BlockchainRepository {
        return this.getResource<BlockchainRepository>(BLOCKCHAIN_REPOSITORY_SUB);
    }

    private initRepositories() {
        // Chain repositories
        this.repositories[NODE_REPOSITORY_SUB] = new NodeRepository(this.currentEndpointsConfig);
        this.repositories[TRANSACTION_REPOSITORY_SUB] = new TransactionRepository(this.currentEndpointsConfig);
        this.repositories[UNIK_REPOSITORY_SUB] = new UnikRepository(this.currentEndpointsConfig);
        this.repositories[NFT_REPOSITORY_SUB] = new NftRepository(this.currentEndpointsConfig);
        this.repositories[WALLET_REPOSITORY_SUB] = new WalletRepository(this.currentEndpointsConfig);
        this.repositories[DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB] = new DiscloseDemandCertificationRepository(
            this.currentEndpointsConfig,
        );
        this.repositories[BLOCKCHAIN_REPOSITORY_SUB] = new BlockchainRepository(this.currentEndpointsConfig);

        // Unik-name services
        this.repositories[FINGERPRINT_REPOSITORY_SUB] = new FingerprintRepository(this.currentEndpointsConfig);
        this.repositories[SAFETYPO_REPOSITORY_SUB] = new SafetypoRepository(this.currentEndpointsConfig);
    }

    private static computeCurrentEndpointsConfig(unsClientConfig: UNSClientConfig): EndpointsConfig {
        const { network, customNode } = unsClientConfig;

        const currentEndpointsConfig = UNSConfig[network];

        if (customNode) {
            currentEndpointsConfig.chain = { url: customNode, customValue: true };
        }
        return currentEndpointsConfig;
    }
}

import { DEFAULT_CLIENT_CONFIG, UNSClientConfig } from "../config";
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
} from "./repositories";
import { BlockchainRepository } from "./repositories/blockchain";
import { WalletRepository, WALLET_REPOSITORY_SUB } from "./repositories/wallet";
import { Repository } from "./repository";

export class UNSClient {
    public repositories: Record<string, Repository> = {};

    private config: UNSClientConfig = DEFAULT_CLIENT_CONFIG;

    public init(config: UNSClientConfig): UNSClient {
        this.config = config;
        this.initRepositories();
        return this;
    }

    public get configuration(): UNSClientConfig {
        return this.config;
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
        const { network, customNode } = this.configuration;
        this.repositories[NODE_REPOSITORY_SUB] = new NodeRepository(network, customNode);
        this.repositories[TRANSACTION_REPOSITORY_SUB] = new TransactionRepository(network, customNode);
        this.repositories[UNIK_REPOSITORY_SUB] = new UnikRepository(network, customNode);
        this.repositories[WALLET_REPOSITORY_SUB] = new WalletRepository(network, customNode);
        this.repositories[FINGERPRINT_REPOSITORY_SUB] = new FingerprintRepository(network);
        this.repositories[SAFETYPO_REPOSITORY_SUB] = new SafetypoRepository(network);
        this.repositories[DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB] = new DiscloseDemandCertificationRepository(
            network,
        );
        this.repositories[BLOCKCHAIN_REPOSITORY_SUB] = new BlockchainRepository(network, customNode);
    }
}

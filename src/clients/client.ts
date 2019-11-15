import {
    TransactionRepository,
    UnikRepository,
    NodeRepository,
    FINGERPRINT_REPOSITORY_SUB,
    SAFETYPO_REPOSITORY_SUB,
    UNIK_REPOSITORY_SUB,
    TRANSACTION_REPOSITORY_SUB,
    NODE_REPOSITORY_SUB,
    FingerprintRepository,
    SafetypoRepository,
    DiscloseDemandCertificationRepository,
    DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB,
} from "./repositories";
import { Network, UNSClientConfig } from "../config";
import { Repository } from "./repository";
import { WalletRepository, WALLET_REPOSITORY_SUB } from "./repositories/wallet";

export class UNSClient {
    public repositories: Record<string, Repository> = {};

    public init(config: UNSClientConfig): UNSClient {
        this.initRepositories(config.network, config.customNode);
        return this;
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

    private initRepositories(network: Network, customNode?: string) {
        this.repositories[NODE_REPOSITORY_SUB] = new NodeRepository(network, customNode);
        this.repositories[TRANSACTION_REPOSITORY_SUB] = new TransactionRepository(network, customNode);
        this.repositories[UNIK_REPOSITORY_SUB] = new UnikRepository(network, customNode);
        this.repositories[WALLET_REPOSITORY_SUB] = new WalletRepository(network, customNode);
        this.repositories[FINGERPRINT_REPOSITORY_SUB] = new FingerprintRepository(network);
        this.repositories[SAFETYPO_REPOSITORY_SUB] = new SafetypoRepository(network);
        this.repositories[DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB] = new DiscloseDemandCertificationRepository(
            network,
        );
    }
}

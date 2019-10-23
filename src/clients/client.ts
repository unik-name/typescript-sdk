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
import { Network, Config, isConfig, fromNetwork } from "../config";
import { Repository } from "./repository";
import { WalletRepository, WALLET_REPOSITORY_SUB } from "./repositories/wallet";

export class UNSClient {
    public repositories: Record<string, Repository> = {};

    private readonly config: Config;

    constructor(config: Network | Config) {
        if (isConfig(config)) {
            // config is Config type
            this.config = config;
        } else {
            // config is Network type
            this.config = fromNetwork(config);
        }
        this.initRepositories();
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

    private initRepositories() {
        this.repositories[NODE_REPOSITORY_SUB] = new NodeRepository(this.config);
        this.repositories[TRANSACTION_REPOSITORY_SUB] = new TransactionRepository(this.config);
        this.repositories[UNIK_REPOSITORY_SUB] = new UnikRepository(this.config);
        this.repositories[WALLET_REPOSITORY_SUB] = new WalletRepository(this.config);
        this.repositories[FINGERPRINT_REPOSITORY_SUB] = new FingerprintRepository(this.config);
        this.repositories[SAFETYPO_REPOSITORY_SUB] = new SafetypoRepository(this.config);
        this.repositories[DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB] = new DiscloseDemandCertificationRepository(
            this.config,
        );
    }
}

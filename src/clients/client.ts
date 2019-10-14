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
} from "./repositories";
import { Network } from "../config";
import { Repository } from "./repository";

export class UNSClient {
    public repositories: Record<string, Repository> = {};

    constructor(network: Network) {
        this.initRepositories(network);
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

    public get fingerprint(): FingerprintRepository {
        return this.getResource<FingerprintRepository>(FINGERPRINT_REPOSITORY_SUB);
    }

    public get safetypo(): SafetypoRepository {
        return this.getResource<SafetypoRepository>(SAFETYPO_REPOSITORY_SUB);
    }

    private initRepositories(network: Network) {
        this.repositories[NODE_REPOSITORY_SUB] = new NodeRepository(network);
        this.repositories[TRANSACTION_REPOSITORY_SUB] = new TransactionRepository(network);
        this.repositories[UNIK_REPOSITORY_SUB] = new UnikRepository(network);
        this.repositories[FINGERPRINT_REPOSITORY_SUB] = new FingerprintRepository(network);
        this.repositories[SAFETYPO_REPOSITORY_SUB] = new SafetypoRepository(network);
    }
}

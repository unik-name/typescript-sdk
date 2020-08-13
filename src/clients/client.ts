import { DEFAULT_CLIENT_CONFIG, EndpointsConfig, UNSClientConfig, UNSConfig } from "../config";
import {
    BLOCKCHAIN_REPOSITORY_SUB,
    DiscloseDemandCertificationRepository,
    DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB,
    FingerprintRepository,
    FINGERPRINT_REPOSITORY_SUB,
    MINT_DEMAND_CERTIFICATION_REPOSITORY_SUB,
    NftRepository,
    NFT_REPOSITORY_SUB,
    NodeRepository,
    NODE_REPOSITORY_SUB,
    SafetypoRepository,
    SAFETYPO_REPOSITORY_SUB,
    TransactionRepository,
    TRANSACTION_REPOSITORY_SUB,
    UnikRepository,
    UNIK_REPOSITORY_SUB,
    UpdateDemandCertificationRepository,
    UPDATE_DEMAND_CERTIFICATION_REPOSITORY_SUB,
    NetworkUnitServicesRepository,
    NETWORK_UNIT_SERVICES_REPOSITORY_SUB,
    UnikPatternRepository,
    UNIK_PATTERN_REPOSITORY_SUB,
    UnikVoucherRepository,
    VOUCHER_REPOSITORY_SUB,
    BLOCKS_REPOSITORY_SUB,
    BlocksRepository as BlockRepository,
} from "./repositories";
import { BlockchainRepository } from "./repositories/blockchain";
import { MintDemandCertificationRepository } from "./repositories/nftMintDemandCertification";
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

    public get mintDemandCertification(): MintDemandCertificationRepository {
        return this.getResource<MintDemandCertificationRepository>(MINT_DEMAND_CERTIFICATION_REPOSITORY_SUB);
    }

    public get updateDemandCertification(): MintDemandCertificationRepository {
        return this.getResource<MintDemandCertificationRepository>(UPDATE_DEMAND_CERTIFICATION_REPOSITORY_SUB);
    }

    public get networkUnitServices(): NetworkUnitServicesRepository {
        return this.getResource<NetworkUnitServicesRepository>(NETWORK_UNIT_SERVICES_REPOSITORY_SUB);
    }

    public get unikPattern(): UnikPatternRepository {
        return this.getResource<UnikPatternRepository>(UNIK_PATTERN_REPOSITORY_SUB);
    }

    public get vouchers(): UnikVoucherRepository {
        return this.getResource<UnikVoucherRepository>(VOUCHER_REPOSITORY_SUB);
    }

    public get block(): BlockRepository {
        return this.getResource<BlockRepository>(BLOCKS_REPOSITORY_SUB);
    }

    private initRepositories() {
        // Chain repositories
        this.repositories[NODE_REPOSITORY_SUB] = new NodeRepository(this.currentEndpointsConfig, this.config);
        this.repositories[TRANSACTION_REPOSITORY_SUB] = new TransactionRepository(
            this.currentEndpointsConfig,
            this.config,
        );
        this.repositories[UNIK_REPOSITORY_SUB] = new UnikRepository(this.currentEndpointsConfig, this.config);
        this.repositories[NFT_REPOSITORY_SUB] = new NftRepository(this.currentEndpointsConfig, this.config);
        this.repositories[WALLET_REPOSITORY_SUB] = new WalletRepository(this.currentEndpointsConfig, this.config);
        this.repositories[DISCLOSE_DEMAND_CERTIFICATION_REPOSITORY_SUB] = new DiscloseDemandCertificationRepository(
            this.currentEndpointsConfig,
            this.config,
        );
        this.repositories[BLOCKCHAIN_REPOSITORY_SUB] = new BlockchainRepository(
            this.currentEndpointsConfig,
            this.config,
        );

        // Unik-name services
        this.repositories[FINGERPRINT_REPOSITORY_SUB] = new FingerprintRepository(
            this.currentEndpointsConfig,
            this.config,
        );
        this.repositories[SAFETYPO_REPOSITORY_SUB] = new SafetypoRepository(this.currentEndpointsConfig, this.config);
        this.repositories[MINT_DEMAND_CERTIFICATION_REPOSITORY_SUB] = new MintDemandCertificationRepository(
            this.currentEndpointsConfig,
            this.config,
        );
        this.repositories[UPDATE_DEMAND_CERTIFICATION_REPOSITORY_SUB] = new UpdateDemandCertificationRepository(
            this.currentEndpointsConfig,
            this.config,
        );
        this.repositories[NETWORK_UNIT_SERVICES_REPOSITORY_SUB] = new NetworkUnitServicesRepository(
            this.currentEndpointsConfig,
            this.config,
        );
        this.repositories[UNIK_PATTERN_REPOSITORY_SUB] = new UnikPatternRepository(
            this.currentEndpointsConfig,
            this.config,
        );
        this.repositories[VOUCHER_REPOSITORY_SUB] = new UnikVoucherRepository(this.currentEndpointsConfig, this.config);

        this.repositories[BLOCKS_REPOSITORY_SUB] = new BlockRepository(this.currentEndpointsConfig, this.config);
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

import { APIClient } from "../client";
import {
    FingerprintRepository,
    FingerprintRepositorySub,
    SafetypoRepository,
    SafetypoRepositorySub,
    UnikRepository,
    UnikRepositorySub,
} from "./repository";
import { UniknameConfig, Network } from "../../config";

export class UniknameClient extends APIClient {
    constructor(network: Network = APIClient.DEFAULT_NETWORK) {
        super(network);
        this.headers["Uns-Network"] = network;
    }

    public get fingerprint(): FingerprintRepository {
        return this.getResource<FingerprintRepository>(FingerprintRepositorySub);
    }

    public get safetypo(): SafetypoRepository {
        return this.getResource<SafetypoRepository>(SafetypoRepositorySub);
    }

    public get unik(): UnikRepository {
        return this.getResource<UnikRepository>(UnikRepositorySub);
    }

    protected initRepositories(client: APIClient) {
        client.repositories[FingerprintRepositorySub] = new FingerprintRepository(client);
        client.repositories[SafetypoRepositorySub] = new SafetypoRepository(client);
        client.repositories[UnikRepositorySub] = new UnikRepository(client);
    }

    protected config() {
        return UniknameConfig;
    }
}

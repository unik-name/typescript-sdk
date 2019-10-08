import { APIClient } from "../client";
import {
    FingerprintRepository,
    FingerprintRepositorySub,
    SafetypoRepository,
    SafetypoRepositorySub,
} from "./repository";
import { UniknameConfig } from "../../config";

export class UniknameClient extends APIClient {
    public get fingerprint(): FingerprintRepository {
        return this.getResource<FingerprintRepository>(FingerprintRepositorySub);
    }

    public get safetypo(): SafetypoRepository {
        return this.getResource<SafetypoRepository>(SafetypoRepositorySub);
    }

    protected initRepositories(client: APIClient) {
        client.repositories[FingerprintRepositorySub] = new FingerprintRepository(client);
        client.repositories[SafetypoRepositorySub] = new SafetypoRepository(client);
    }

    protected config() {
        return UniknameConfig;
    }
}

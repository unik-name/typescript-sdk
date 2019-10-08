import { APIClient } from "../client";
import {
    TransactionRepository,
    TransactionRepositorySub,
    UnikRepository,
    UnikRepositorySub,
    NodeRepository,
    NodeRepositorySub,
} from "./repositories";
import { UNSConfig } from "../../config";

export class UNSClient extends APIClient {
    public get node(): NodeRepository {
        return this.getResource<NodeRepository>(NodeRepositorySub);
    }

    public get transaction(): TransactionRepository {
        return this.getResource<TransactionRepository>(TransactionRepositorySub);
    }

    public get unik(): UnikRepository {
        return this.getResource<UnikRepository>(UnikRepositorySub);
    }

    protected initRepositories(client: APIClient) {
        client.repositories[NodeRepositorySub] = new NodeRepository(client);
        client.repositories[TransactionRepositorySub] = new TransactionRepository(client);
        client.repositories[UnikRepositorySub] = new UnikRepository(client);
    }

    protected config() {
        return UNSConfig;
    }
}

import { HTTPClient, Response } from "../..";
import {
    SearchNetworkUnitServiceRequest,
    NetworkUnitService,
    SearchNetworkUnitMintServiceRequest,
    NetworkUnitMintService,
} from "./types";
import { get, post } from "../service-repository";

export const networkUnitServicesSearch = (client: HTTPClient) => (
    parameters: SearchNetworkUnitServiceRequest,
): Promise<Response<NetworkUnitService>> =>
    post<NetworkUnitService>(client)("network-unit-services/search", undefined, parameters);

export const networkUnikServicesGetMintServices = (client: HTTPClient) => ({
    dtype,
}: SearchNetworkUnitMintServiceRequest): Promise<Response<NetworkUnitMintService[]>> =>
    get<NetworkUnitMintService[]>(client)("network-unit-services/mint", { dtype });

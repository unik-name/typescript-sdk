import { HTTPClient, Response } from "../..";
import { Interfaces } from "@uns/ark-crypto";
import { get } from "../network-repository";
import { NodeStatus, NodeConfiguration } from "./types";

export const nodeStatus = (client: HTTPClient) => (): Promise<Response<NodeStatus>> =>
    get<Response<NodeStatus>>(client)("node/status");

export const nodeConfiguration = (client: HTTPClient) => (): Promise<Response<NodeConfiguration>> =>
    get<Response<NodeConfiguration>>(client)("node/configuration");

export const nodeConfigurationCrypto = (client: HTTPClient) => (): Promise<Response<Interfaces.INetworkConfig>> =>
    get<Response<Interfaces.INetworkConfig>>(client)("node/configuration/crypto");

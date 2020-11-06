import { UnikProperties } from "./types";
import { isActiveProperty } from "./utils";
import { HTTPClient, ResponseWithChainMeta } from "../..";
import { get } from "../network-repository";

export const getUnikProperties = (client: HTTPClient) => (id: string): Promise<ResponseWithChainMeta<UnikProperties>> =>
    get<ResponseWithChainMeta<UnikProperties>>(client)(`uniks/${id}/properties`).then(response => {
        response.data = response.data?.filter(isActiveProperty);
        return response;
    });

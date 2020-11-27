import nock = require("nock");
import { API_ENDPOINT, CHAIN_ENDPOINT } from "../__fixtures__/tests-commons";

export const mockUnikRequest = (unikid: string, data: any, chainmeta?: any) => {
    nock(CHAIN_ENDPOINT)
        .get(`/uniks/${unikid}`)
        .reply(200, { data, chainmeta });
};

export const mockUnikPattern = (data: any) => {
    nock(API_ENDPOINT)
        .post("/unik-pattern")
        .reply(200, {
            data,
        });
};

export const mockServiceSearch = (data: any) => {
    nock(API_ENDPOINT)
        .post("/network-unit-services/search")
        .reply(200, {
            data,
        });
};

export const mockMintCertification = (data: any) => {
    nock(API_ENDPOINT)
        .post("/mint-demand-certification")
        .reply(200, {
            data,
        });
};

export const mockUpdateCertification = (data: any) => {
    nock(API_ENDPOINT)
        .post("/update-demand-certification")
        .reply(200, {
            data,
        });
};

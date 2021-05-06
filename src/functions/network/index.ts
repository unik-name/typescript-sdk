import { HTTPClient, nodeStatus } from "../..";

export const roundFromHeightAndDelegates = (height: number, activeDelegates: number): number => {
    if (isNaN(height)) {
        return 0;
    }
    return Math.floor(height / activeDelegates) + (height % activeDelegates > 0 ? 1 : 0);
};

export const getCurrentHeight = (http: HTTPClient): Promise<number> => nodeStatus(http)().then(r => r.data!.now!);

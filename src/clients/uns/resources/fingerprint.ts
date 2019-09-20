/* eslint-disable max-classes-per-file */

import { HTTPOptions } from "../../http";
import { Resource } from "./resource";

export interface FingerPrint {
    fingerprint: string;
}

export class FingerPrintResource extends Resource {
    public static PATH: string = "unik-name-fingerprint";

    public path(): string {
        return FingerPrintResource.PATH;
    }

    public async computeFingerprint(opts?: HTTPOptions): Promise<FingerPrint> {
        return this.sendPost<FingerPrint>("", opts);
    }
}

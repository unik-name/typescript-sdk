/* eslint-disable max-classes-per-file */

import { HTTPOptions } from "../../http";
import { Resource } from "./resource";

export interface SafeTypoResult {
    core: string;
}

export class Safetypo extends Resource {
    public static PATH: string = "safetypo";

    public path(): string {
        return Safetypo.PATH;
    }

    public async analyze(opts?: HTTPOptions): Promise<SafeTypoResult> {
        return this.sendPost<SafeTypoResult>("", opts);
    }
}

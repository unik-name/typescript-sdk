import { isUnikId } from "@uns/crypto";
import { PropertyValue, ResponseWithChainMeta, Token, Tokens, UNSClient } from "src/clients";
import { getPropertyValue, LifeCycleGrades } from "../unik";

export async function throwIfNotAllowedToVote(client: UNSClient, walletOrUnikid: string): Promise<void> {
    let uniksId: string[] = [];
    if (isUnikId(walletOrUnikid)) {
        uniksId = [walletOrUnikid];
    } else {
        const tokens: ResponseWithChainMeta<Tokens> = await client.wallet.tokens(walletOrUnikid);
        if (tokens.data) {
            uniksId = tokens.data.map((token: Token): string => token.id);
        }
    }

    if (!uniksId.length) {
        throw new Error("Cryptoaccount has no @unikname.");
    }

    // Check tokens LifeCycle status
    const promises = uniksId.map((unik: string) => getPropertyValue(unik, "LifeCycle/Status", client));
    if (
        !((await Promise.all(promises)) as string[]).some((lifeStatus: PropertyValue) => {
            const currentLifeCycle = parseInt(lifeStatus);
            return (
                !isNaN(currentLifeCycle) &&
                (currentLifeCycle === LifeCycleGrades.LIVE || currentLifeCycle === LifeCycleGrades.EVERLASTING)
            );
        })
    ) {
        throw new Error(
            '@unikname of cryptoaccount has to be alive or everlasting ("LifeCycle/Status" = 3 or 100) to vote.',
        );
    }
}

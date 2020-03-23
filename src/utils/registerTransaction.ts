import { Transactions, Errors } from "@uns/ark-crypto";

export const registerTransaction = (constructor: Transactions.TransactionConstructor) => {
    try {
        Transactions.TransactionRegistry.registerTransactionType(constructor);
    } catch (e) {
        if (!(e instanceof Errors.TransactionAlreadyRegisteredError)) {
            throw e;
        }
    }
};

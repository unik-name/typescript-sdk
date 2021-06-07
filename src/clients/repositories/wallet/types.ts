export type Wallet = {
    address: string;
    publicKey: string;
    username?: string;
    secondPublicKey?: string;
    balance: number;
    isDelegate: boolean;
    isResigned: boolean;
    vote?: string;
    nonce?: string;
    attributes?: Record<string, any>;
};

export type Token = {
    id: string;
    ownerId: string;
};

export type Tokens = Token[];

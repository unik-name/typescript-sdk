export type Wallet = {
    address: string;
    publicKey: string;
    username?: string;
    secondPublicKey?: string;
    balance: number;
    isDelegate: boolean;
    vote?: string;
    nonce?: string;
};

export type Token = {
    id: string;
    ownerId: string;
};

export type Tokens = Token[];

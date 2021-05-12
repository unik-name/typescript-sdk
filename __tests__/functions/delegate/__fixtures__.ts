export const nodeStatus = (height: number = 3000) => ({
    synced: true,
    now: height,
    blocksCount: -10,
    timestamp: 130527611,
});

export const nodeConfig = (activeDelegates: number = 10) => ({
    constants: {
        activeDelegates,
        nbDelegatesByType: {
            individual: 4,
            organization: 4,
            network: 2,
        },
    },
});

// --- Generators
/*eslint no-bitwise: ["error", { "allow": ["~"] }] */
const generateString = (base: number) => (length: number) =>
    [...Array(length)].map(_ => (~~(Math.random() * base)).toString(base)).join("");
export const unikId = () => generateString(16)(64);
export const pubkey = () => generateString(16)(66);
export const address = () => generateString(36)(34);
export const explicit = () => generateString(36)(10);
const generateDelegate = ({ type, resigned }: { type?: string; resigned?: boolean } = {}) => ({
    username: unikId(),
    type: type || "individual",
    address: address(),
    publicKey: pubkey(),
    isResigned: resigned || false,
});
// ------------

export const resignedDelegates = [
    generateDelegate({ type: "individual" }),
    generateDelegate({ type: "organization" }),
    generateDelegate({ type: "individual" }),
    generateDelegate({ type: "individual" }),
].map(d => ({ ...d, isResigned: true }));

export const individualDelegates = [...Array(12)].map(_ => generateDelegate({ type: "individual" }));
export const organizationDelegates = [...Array(8)].map(_ => generateDelegate({ type: "organization" }));
const networkDelegates = [...Array(5)].map(_ => generateDelegate({ type: "network" }));

export const registeredDelegates = [...individualDelegates, ...organizationDelegates, ...networkDelegates];
export const activeIndividualDelegates = individualDelegates.slice(0, 4);
const activeOrganizationDelegates = organizationDelegates.slice(0, 4);
const activeNetworkDelegates = networkDelegates.slice(0, 2);
const activeDelegates = [...activeIndividualDelegates, ...activeOrganizationDelegates, ...activeNetworkDelegates];

export const delegates = [...registeredDelegates, ...resignedDelegates];
export const roundsDelegates = activeDelegates.map(({ publicKey }) => ({ publicKey }));
export const uniks = delegates.map(({ username, type }) => ({
    id: username,
    type,
    defaultExplicitValue: explicit(),
}));
export const uniksMap = uniks.reduce<Record<string, string>>((a, u) => {
    a[u.id] = u.defaultExplicitValue;
    return a;
}, {});
export const voter = (delegateUsername: string = pubkey()): any => {
    const wallet = {
        address: address(),
        attributes: {
            vote: delegateUsername,
        },
    };
    const unik = {
        id: unikId(),
        ownerId: wallet.address,
    };

    return { wallet, unik };
};

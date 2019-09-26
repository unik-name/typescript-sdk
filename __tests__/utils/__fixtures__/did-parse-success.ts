export const shouldPass: any[] = [
    {
        did: "@unik:organization/Space_Elephant",
        result: { tokenName: "unik", type: "organization", explicitValue: "Space_Elephant", query: undefined },
    },
    {
        did: "@unik:organization/Space_Elephant?phone",
        result: { tokenName: "unik", type: "organization", explicitValue: "Space_Elephant", query: "?phone" },
    },
    {
        did: "@unik:organization/Space_Elephant?postalAddress",
        result: { tokenName: "unik", type: "organization", explicitValue: "Space_Elephant", query: "?postalAddress" },
    },
    {
        did: "@unik:organization/Space_Elephant?X509fingerPrint",
        result: { tokenName: "unik", type: "organization", explicitValue: "Space_Elephant", query: "?X509fingerPrint" },
    },
    {
        did: "@unik:individual/bob?*",
        result: { tokenName: "unik", type: "individual", explicitValue: "bob", query: "?*" },
    },
    {
        did: "@unik:individual/bob-123?*",
        result: { tokenName: "unik", type: "individual", explicitValue: "bob-123", query: "?*" },
    },
    {
        did: "@unik:individual/bob_123?*",
        result: { tokenName: "unik", type: "individual", explicitValue: "bob_123", query: "?*" },
    },
    {
        did: "@unik:1/bob_123?*",
        result: { tokenName: "unik", type: "individual", explicitValue: "bob_123", query: "?*" },
    },
    {
        did: "@unik:bob_123?*",
        result: { tokenName: "unik", type: "individual", explicitValue: "bob_123", query: "?*" },
    },
    {
        did: "@1/bob_123?*",
        result: { tokenName: "unik", type: "individual", explicitValue: "bob_123", query: "?*" },
    },
    {
        did: "@2/bob_123?*",
        result: { tokenName: "unik", type: "organization", explicitValue: "bob_123", query: "?*" },
    },
];
export const codes = {
    UNKNOWN_ERROR: {
        code: "1",
        message: "Unknown error",
    },
    HTTP_ERROR_RECEIVED: {
        code: "2",
        message: "HTTP error received",
    },
    DID_PARSER_ERROR: {
        code: "3",
        message: "DID Parser error",
    },

    /**
     * Minting errors
     */
    MINT_ERROR_CREATION_DATA_NULL: {
        code: "10",
        message: "Error creating mint demand certification because 'reponse.data' is undefined or null",
    },

    /**
     * Nft update errors
     */
    UPDATE_ERROR_CREATION_DATA_NULL: {
        code: "20",
        message: "Error creating update demand certification because 'reponse.data' is undefined or null",
    },

    CERTIFICATION_ISSUER_OWNER_ERROR: {
        code: "30",
        message: "Error fetching issuer crypto account address",
    },

    UNIK_PATTERN_MALFORMED_ERROR: {
        code: "40",
        message: "Malformed unik pattern",
    },

    UNIK_VOUCHER_FORMAT_ERROR: {
        code: "50",
        message: "Malformed unik-voucher",
    },
};

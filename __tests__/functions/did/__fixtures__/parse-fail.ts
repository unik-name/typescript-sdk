import { DidParserError } from "../../../../src";

const EMPTY_DID_ERROR_MSG = "Empty DID";
const PATTERN_MATCHING_ERROR_MSG = "DID does not match expected format";
const INVALID_EXPLICIT_VALUE_FORMAT_MSG = "Invalid explicit value format";

export const shouldFail: any[] = [
    {
        did: "@unikorganization:Space_Elephant?phone",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unikorganization:Space_Elephant?postalAddress",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unikorganization:Space_Elephant?X509fingerPrint",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unikindividual:bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:?",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik?",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "",
        error: DidParserError,
        message: EMPTY_DID_ERROR_MSG,
    },
    {
        did: ":?",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: ":",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@?",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "?",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@:/?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@::?",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@::",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@::?phone",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@:Space_Elephant?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization:bob?phone@number",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        // Only one property
        did: "@unik:organization:bob?phone?number",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        // No space in property
        did: "@unik:organization:bob?phone number",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization:bob?phone#number",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization:bob?phoneαnumber",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:uns:bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:0:bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:4:bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did:
            "@unik:individual:tooLongExplicitValueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee?*",
        error: DidParserError,
        message: INVALID_EXPLICIT_VALUE_FORMAT_MSG,
    },
    {
        did: "@unik:individual:nop:qon?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual:Space_Elephant?a*b",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@myUnknownTokenName:individual:Space_Elephant?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },

    {
        did: "@unik:organization:/Space_Elephant",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization:/Space_Elephant?phone",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization:/Space_Elephant?postalAddress",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization:/Space_Elephant?X509fingerPrint",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual:/bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual:/bob-123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:1:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@1:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@2:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization:/Space_Elephant",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization:/Space_Elephant?phone",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization:/Space_Elephant?postalAddress",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization:/Space_Elephant?X509fingerPrint",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual:/bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:individual:/bob-123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:individual:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:1:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "1:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "2:/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },

    {
        did: "@unik:organization/Space_Elephant",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization/Space_Elephant?phone",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization/Space_Elephant?postalAddress",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization/Space_Elephant?X509fingerPrint",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual/bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual/bob-123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:1/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@1/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@2/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization/Space_Elephant",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization/Space_Elephant?phone",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization/Space_Elephant?postalAddress",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization/Space_Elephant?X509fingerPrint",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual/bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:individual/bob-123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:individual/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:1/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "1/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "2/bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },

    {
        did: "@unik:organization/:Space_Elephant",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization/:Space_Elephant?phone",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization/:Space_Elephant?postalAddress",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:organization/:Space_Elephant?X509fingerPrint",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual/:bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual/:bob-123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:1/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@1/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@2/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization/:Space_Elephant",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization/:Space_Elephant?phone",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization/:Space_Elephant?postalAddress",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:organization/:Space_Elephant?X509fingerPrint",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "@unik:individual/:bob?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:individual/:bob-123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:individual/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik:1/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "unik/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "1/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
    {
        did: "2/:bob_123?*",
        error: DidParserError,
        message: PATTERN_MATCHING_ERROR_MSG,
    },
];

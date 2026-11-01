/**
 * Text direction inside right-to-left (Hebrew) pages and chats. A math
 * expression wrapped in an isolate (U+2066 LRI … U+2069 PDI) keeps its
 * left-to-right order: "7 × 8 = 56" never shows as "56 = 8 × 7".
 */
const ltr = (s) => `⁦${s}⁩`;

module.exports = { ltr };

/**
 * The Hebrew senses of a stored translation, for the bot's word options (a
 * wrong option never shares one with the answer).
 *
 * A stored translation may list alternatives ("לגמרי לבד / בעצמו", "גדול,
 * ענק") and optional parts in parentheses ("(מאוד) גדול"). Senses ignore
 * nikkud, punctuation, letter case (Latin) and extra spaces.
 */

const NIKKUD = /[֑-ׇ]/g;
const PUNCT = /[.,!?;:"'`׳״\-–—_*()[\]{}/|]/g;

/** Canonical form of one Hebrew phrase. */
function normalize(text) {
  return String(text || '')
    .normalize('NFC')
    .replace(/[⁦-⁩‎‏]/g, '')
    .replace(NIKKUD, '')
    .replace(PUNCT, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every accepted form of a stored translation, normalised. */
function alternatives(translation) {
  // The whole entry counts too: a student who writes "כוס / זכוכית" is right.
  const forms = new Set([normalize(translation)]);
  for (const part of String(translation || '').split(/[/,;|]|\s+או\s+/)) {
    const raw = part.trim();
    if (!raw) continue;
    forms.add(normalize(raw));
    // A parenthesised part is optional: accept the phrase without it too.
    if (/\(.*?\)/.test(raw)) forms.add(normalize(raw.replace(/\(.*?\)/g, ' ')));
  }
  forms.delete('');
  return [...forms];
}

module.exports = { normalize, alternatives };

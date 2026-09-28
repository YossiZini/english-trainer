/**
 * Free-text matching of a Hebrew translation against the stored one.
 *
 * The bot student types the translation; the stored translation may list
 * alternatives ("לגמרי לבד / בעצמו", "גדול, ענק") and optional parts in
 * parentheses ("(מאוד) גדול"). Matching ignores nikkud, punctuation, letter
 * case (Latin) and extra spaces. Nothing is judged by a model.
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

/** True when the student's text matches any accepted form. */
function hebrewAnswerMatches(userText, translation) {
  const given = normalize(userText);
  if (!given) return false;
  return alternatives(translation).includes(given);
}

/**
 * Whether a non-matching answer may be sent to a model for a second opinion:
 * short, and Hebrew letters (plus spaces and punctuation) only, so a message
 * can never carry instructions in another language to the judge.
 */
function judgeable(userText, maxChars = 40) {
  const t = String(userText || '').trim();
  return t.length > 0 && t.length <= maxChars && /[\u05D0-\u05EA]/.test(t)
    && /^[\u0590-\u05FF\s.,'"׳״\-()/]+$/.test(t);
}

module.exports = { normalize, alternatives, hebrewAnswerMatches, judgeable };

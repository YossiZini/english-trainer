/**
 * Free-text matching of an English word against the stored one, for the
 * bot's Hebrew→English words exam.
 *
 * Stored entries may list alternatives ("adviser/advisor", "a bit; a little"),
 * optional parts in parentheses ("(just) in case"), placeholders ("about to do
 * sth") and a trailing "etc". Matching ignores case, punctuation, extra
 * spaces and a leading a/an/the/to, and forgives one wrong, missing or extra
 * letter in words of five letters or more. Nothing is judged by a model.
 */

const PLACEHOLDERS = new Set(['sth', 'sb', 'something', 'someone', 'somebody', 'etc']);
const LEADING = /^(a|an|the|to) /;

/** Canonical form of one English phrase. */
function normalize(text) {
  return String(text || '')
    .normalize('NFC')
    .replace(/[’‘`]/g, "'")
    .toLowerCase()
    .replace(/[.,!?;:"()[\]{}*_–—]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The phrase without a leading article or "to", and without placeholders. */
function core(text) {
  const words = normalize(text).split(' ').filter(w => w && !PLACEHOLDERS.has(w));
  let phrase = words.join(' ');
  while (LEADING.test(phrase)) phrase = phrase.replace(LEADING, '');
  return phrase;
}

/** Expand "a sharp rise/increase/drop" into one phrase per slashed choice. */
function expandSlashes(phrase) {
  let forms = [''];
  for (const token of phrase.split(/\s+/).filter(Boolean)) {
    const choices = token.split('/').filter(Boolean);
    forms = forms.flatMap(f => choices.map(c => `${f} ${c}`)).slice(0, 50);
  }
  return forms.map(f => f.trim());
}

/** Every accepted form of a stored English entry, as core forms. */
function alternatives(english) {
  const forms = new Set();
  for (const part of String(english || '').split(/;/)) {
    const raw = part.trim();
    if (!raw) continue;
    // Optional parenthesised part: with and without it.
    const variants = /\(.*?\)/.test(raw) ? [raw.replace(/[()]/g, ' '), raw.replace(/\(.*?\)/g, ' ')] : [raw];
    for (const v of variants) {
      for (const phrase of expandSlashes(v.replace(/\s*\/\s*/g, '/'))) forms.add(core(phrase));
    }
  }
  forms.delete('');
  return [...forms];
}

/** Edit distance, stopping early once it is above `max`. */
function withinOneEdit(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/**
 * How the student's text matches the stored English entry, or one of
 * `others` (other English words stored with the same Hebrew translation):
 * 'exact', 'typo' (one letter off), or null. A typo can be another real
 * word ("horse" for "house"); the caller decides with `core(userText)`.
 */
function englishAnswerMatch(userText, english, others = []) {
  const given = core(userText);
  if (!given) return null;
  const forms = [english, ...others].flatMap(alternatives);
  if (forms.includes(given)) return 'exact';
  return forms.some(form => form.length >= 5 && withinOneEdit(given, form)) ? 'typo' : null;
}

/**
 * Whether a non-matching English answer may go to the model for a second
 * opinion: short, Latin letters (plus spaces and simple punctuation) only.
 */
function judgeable(userText, maxChars = 40) {
  const t = String(userText || '').trim();
  return t.length > 0 && t.length <= maxChars && /[a-z]/i.test(t) && /^[a-z\s.,'’\-/()]+$/i.test(t);
}

/**
 * The example sentence with the answer blanked, for the Hebrew→English
 * exam: every sentence word that starts like a word of the answer (its
 * stem, so "invitations" and "invited" go too) becomes "_____". Null when
 * nothing could be blanked, so the sentence never gives the answer away.
 */
function maskAnswer(sentence, english) {
  if (!sentence) return null;
  const stems = new Set();
  for (const form of alternatives(english)) {
    for (const word of form.split(' ')) {
      if (word.length < 3) continue;
      stems.add(word.length > 4 ? word.slice(0, word.length - 2) : word);
    }
  }
  if (!stems.size) return null;
  let masked = false;
  const out = sentence.replace(/[A-Za-z'’]+/g, (token) => {
    const t = token.toLowerCase();
    if ([...stems].some(stem => t.startsWith(stem))) { masked = true; return '_____'; }
    return token;
  });
  return masked ? out : null;
}

module.exports = { normalize, core, alternatives, englishAnswerMatch, judgeable, maskAnswer };

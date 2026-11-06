/**
 * The English forms of a stored word, for the bot's word options (a wrong
 * option never shares one with the answer) and its "?" hint.
 *
 * Stored entries may list alternatives ("adviser/advisor", "a bit; a little"),
 * optional parts in parentheses ("(just) in case"), placeholders ("about to do
 * sth") and a trailing "etc". Forms ignore case, punctuation, extra spaces and
 * a leading a/an/the/to.
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

module.exports = { normalize, core, alternatives, maskAnswer };

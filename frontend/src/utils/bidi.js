/**
 * Mixed Hebrew/English question text. English-lesson questions are mostly
 * English sentences (left-to-right); some start with a Hebrew instruction or
 * are Hebrew sentences about an English word. Those read right-to-left, and
 * each English stretch inside them is isolated so its blanks and punctuation
 * stay with it ("תקן: She is wanting a new car. → She _______ a new car.").
 */

const HEBREW = /[֐-׿]/;
const ARABIC = /[\u0600-\u06FF]/;
const LATIN = /[A-Za-z]/;

/** Whether the text holds Arabic script (letters or vowel marks). */
export function hasArabic(text) {
  return ARABIC.test(String(text || ''));
}

/** 'rtl' when the first letter of the text is Hebrew or Arabic, else 'ltr'. */
export function textDirection(text) {
  for (const ch of String(text || '')) {
    if (HEBREW.test(ch) || ARABIC.test(ch)) return 'rtl';
    if (LATIN.test(ch)) return 'ltr';
  }
  return 'ltr';
}

/**
 * Split right-to-left text into parts [{ text, ltr }]. An English stretch runs
 * from its first Latin letter (with an opening quote just before it) up to the
 * next Hebrew letter, and ends after its last letter plus any blanks, quotes or
 * closing parentheses; a stretch of several words (a phrase or sentence) also
 * keeps its final . ? or !, while a single quoted word leaves the sentence's
 * final punctuation to the Hebrew around it.
 */
export function isolateEnglish(text) {
  const s = String(text || '');
  const parts = [];
  let plain = '';
  let i = 0;
  while (i < s.length) {
    const quoteThenLatin = /["'“‘]/.test(s[i]) && LATIN.test(s[i + 1] || '');
    if (!LATIN.test(s[i]) && !quoteThenLatin) {
      plain += s[i];
      i++;
      continue;
    }
    // Maximal stretch without Hebrew letters.
    let end = i;
    while (end < s.length && !HEBREW.test(s[end])) end++;
    let chunk = s.slice(i, end);
    // Trim back to the last letter, digit, blank, quote or closing parenthesis.
    const core = chunk.match(/^[\s\S]*[A-Za-z0-9_"'”’)]/);
    chunk = core ? core[0] : chunk;
    const words = chunk.match(/[A-Za-z]+/g) || [];
    if (words.length > 1) {
      const tail = s.slice(i + chunk.length).match(/^[.?!]+/);
      if (tail) chunk += tail[0];
    }
    if (plain) { parts.push({ text: plain, ltr: false }); plain = ''; }
    parts.push({ text: chunk, ltr: true });
    i += chunk.length;
  }
  if (plain) parts.push({ text: plain, ltr: false });
  return parts;
}

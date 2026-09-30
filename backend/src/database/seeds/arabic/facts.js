// Arabic unit 1 facts: the single source for the teaching pages and every
// question of topic 201 (the teacher's material for the 11.10 test, book
// pages 13–25). Reading and recognition only; students never write Arabic.

// Vowel marks (harakat), Unicode combining marks placed after a letter.
const FATHA = 'َ';
const DAMMA = 'ُ';
const KASRA = 'ِ';
const SUKUN = 'ْ';

// The six letters of the unit. `he` is the Hebrew counterpart as taught in
// Israeli schools (ذ is written ד׳, "dal with a geresh").
const LETTERS = [
  { ar: 'د', name: 'דאל', he: 'ד', sound: 'd', note: 'בלי נקודה' },
  { ar: 'ذ', name: 'ד׳אל', he: 'ד׳', sound: 'dh (כמו th במילה this)', note: 'נקודה אחת מעל' },
  { ar: 'ا', name: 'אלף', he: 'א', sound: 'אם קריאה (בלי המזה)', note: 'קו ישר' },
  { ar: 'ر', name: 'רא', he: 'ר', sound: 'r', note: 'בלי נקודה, יורדת מתחת לשורה' },
  { ar: 'ز', name: 'זאי', he: 'ז', sound: 'z', note: 'נקודה אחת מעל' },
  { ar: 'و', name: 'ואו', he: 'ו', sound: 'w', note: 'ראש עגול וזנב' }
];

// Alif with hamza (a consonant, carries a vowel) and without (silent).
const HAMZA_ALIF = 'أ';
const PLAIN_ALIF = 'ا';

// The vowel signs: name, sound and Hebrew counterpart as the teacher gave them.
// Sukun has no Hebrew counterpart in the material: it is "no vowel".
const VOWELS = [
  { mark: FATHA, name: 'פתחה', sound: 'a', he: 'פתח', place: 'קו קטן מעל האות' },
  { mark: DAMMA, name: 'דמה', sound: 'u', he: 'קובוץ', place: 'וו קטנה מעל האות' },
  { mark: KASRA, name: 'כסרה', sound: 'i', he: 'חיריק', place: 'קו קטן מתחת לאות' },
  { mark: SUKUN, name: 'סוכון', sound: 'ללא תנועה', he: null, place: 'עיגול קטן מעל האות' }
];

// The eight words: Arabic with vowels, how it is read (Hebrew letters with
// niqqud), the meaning, and its letters in order with the vowel on each
// (null = no vowel written; the alif without hamza carries none).
const WORDS = [
  {
    ar: 'دَار', read: 'דַאר', meaning: 'בית, דירה, משפחה', short: 'בית',
    letters: [['د', 'פתחה'], ['ا', null], ['ر', null]]
  },
  {
    ar: 'وِدَاد', read: 'וִדַאד', meaning: 'ודאד (שם פרטי של בת)', short: 'ודאד (שם של בת)',
    letters: [['و', 'כסרה'], ['د', 'פתחה'], ['ا', null], ['د', null]]
  },
  {
    ar: 'دَاوُد', read: 'דַאוֻד', meaning: 'דאוד (שם פרטי של בן)', short: 'דאוד (שם של בן)',
    letters: [['د', 'פתחה'], ['ا', null], ['و', 'דמה'], ['د', null]]
  },
  {
    ar: 'وَرْد', read: 'וַרְד', meaning: 'ורדים', short: 'ורדים',
    letters: [['و', 'פתחה'], ['ر', 'סוכון'], ['د', null]]
  },
  {
    ar: 'أَرْز', read: 'אַרְז', meaning: 'ארזים', short: 'ארזים',
    letters: [['أ', 'פתחה'], ['ر', 'סוכון'], ['ز', null]]
  },
  {
    ar: 'أَرَادَ', read: 'אַרַאדַ', meaning: 'רצה (רצה משהו)', short: 'רצה',
    letters: [['أ', 'פתחה'], ['ر', 'פתחה'], ['ا', null], ['د', 'פתחה']]
  },
  {
    ar: 'زَارَ', read: 'זַארַ', meaning: 'ביקר (ביקר במקום כלשהו)', short: 'ביקר',
    letters: [['ز', 'פתחה'], ['ا', null], ['ر', 'פתחה']]
  },
  {
    ar: 'أَو', read: 'אַו', meaning: 'או (ברירה)', short: 'או',
    letters: [['أ', 'פתחה'], ['و', null]]
  }
];

// ذ appears in none of the eight words: its "inside a word" practice uses
// these short letter pairs, presented as pairs, not as words.
const DHAL_PAIRS = ['ذَا', 'ذُو', 'رَذ'];

const letter = (ar) => LETTERS.find((l) => l.ar === ar || (ar === HAMZA_ALIF && l.ar === PLAIN_ALIF));
const vowel = (name) => VOWELS.find((v) => v.name === name);
const word = (ar) => WORDS.find((w) => w.ar === ar);

module.exports = {
  FATHA, DAMMA, KASRA, SUKUN, LETTERS, VOWELS, WORDS, HAMZA_ALIF, PLAIN_ALIF, DHAL_PAIRS,
  letter, vowel, word
};

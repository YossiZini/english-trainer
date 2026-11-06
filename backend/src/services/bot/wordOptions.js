/**
 * Four options for a word question in the bot: the answer, close wrong
 * options that make sense in its place, and words of the same kind.
 *
 * - Close: a word of the same group or the answer's opposite
 *   (data/wordGroups.json: animals, colours, days, family, amounts,
 *   buy/sell...), a word of the same family (absolute/absolutely), or a spelling
 *   look-alike a student confuses (advise/advice, bread/break). Up to two of
 *   them, from nearby levels when there are any.
 * - The rest: words of the same kind from nearby levels (a verb for a verb,
 *   by the Hebrew infinitive's ל; a phrase for a phrase).
 * - Never a wrong option that is also right: no word that shares a Hebrew
 *   sense or an English form with the answer (קצת / מעט, two entries of
 *   "light"), nor one of the answer's accepted alternatives.
 *
 * Options show the English in he-en (Hebrew shown, English chosen) and the
 * Hebrew in en-he. Pure: the caller passes the pool of words.
 */
const GROUPS = require('../../data/wordGroups.json');
const { alternatives: hebrewForms } = require('../../utils/hebrewAnswer');
const { alternatives: englishForms, core } = require('../../utils/englishAnswer');

const OPTION_COUNT = 4;
const MAX_CLOSE = 2;
const CLOSE_LEVELS = 3; // a close option within this many levels, when there is one
const FILL_LEVELS = 2;

const groupsOf = new Map();
for (const [name, members] of Object.entries(GROUPS.groups)) {
  for (const m of members) groupsOf.set(core(m), [...(groupsOf.get(core(m)) || []), name]);
}
const oppositesOf = new Map();
for (const [a, b] of GROUPS.opposites) {
  for (const [x, y] of [[a, b], [b, a]]) oppositesOf.set(core(x), new Set([...(oppositesOf.get(core(x)) || []), core(y)]));
}

/**
 * The English senses of an entry, as core forms: "middle / in the middle"
 * gives "middle" and "in the middle"; "carry on sth / carry sth on" gives
 * "carry on" (a spaced slash or ";" separates senses, an unspaced slash
 * separates words: "adviser/advisor").
 */
function englishSenses(english) {
  const senses = new Set();
  for (const part of String(english || '').split(/\s+\/\s+|;/)) {
    for (const form of englishForms(part)) senses.add(form);
    if (core(part)) senses.add(core(part));
  }
  return senses;
}

const cache = new Map();
/** What the picker needs of a word, computed once per id and text. */
function facts(word) {
  const id = `${word.id}|${word.english_word}|${word.hebrew_translation}`;
  if (!cache.has(id)) {
    const english = englishSenses(word.english_word);
    const hebrew = new Set(hebrewForms(word.hebrew_translation));
    // Its first sense gives its shape: "middle / in the middle" is one word.
    const main = core(String(word.english_word || '').split(/\s+\/\s+|;/)[0]);
    const firstHebrew = String(word.hebrew_translation || '').trim().split(/[\s/,;]/)[0] || '';
    cache.set(id, {
      english, hebrew, main,
      groups: new Set([...english].flatMap((e) => groupsOf.get(e) || [])),
      verb: /^ל/.test(firstHebrew),
      words: Math.min(main.split(' ').length, 3)
    });
  }
  return cache.get(id);
}

const overlaps = (a, b) => [...a].some((x) => b.has(x));

/** Would `candidate` also be a right answer for `answer`'s question, in either direction? */
function alsoRight(answer, candidate) {
  const a = facts(answer), c = facts(candidate);
  if (overlaps(a.hebrew, c.hebrew) || overlaps(a.english, c.english)) return true;
  const accepted = new Set((answer.english_alternatives || []).flatMap((x) => [...englishSenses(x)]));
  return overlaps(c.english, accepted);
}

/** Levenshtein distance, for spelling look-alikes (short words only). */
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = keep;
    }
  }
  return row[b.length];
}

/** The length of the common start of two words. */
const commonStart = (x, y) => {
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  return i;
};

/**
 * How `candidate` is close to `answer`: 'group', 'opposite', 'family',
 * 'look-alike', or null. Of single words only: a family shares its stem
 * (absolute/absolutely, important/importance: five letters or more in
 * common, both six letters or more); a look-alike is five letters or more,
 * starting with the same two letters, one letter away (two for words of
 * seven or more).
 */
function closeness(answer, candidate) {
  const a = facts(answer), c = facts(candidate);
  if (overlaps(a.groups, c.groups)) return 'group';
  if ([...a.english].some((e) => [...c.english].some((x) => (oppositesOf.get(e) || new Set()).has(x)))) return 'opposite';
  if (a.words !== 1 || c.words !== 1) return null;
  const [x, y] = [a.main, c.main];
  const shorter = Math.min(x.length, y.length);
  const stem = commonStart(x, y);
  if (stem >= 5 && shorter >= 6) return 'family';
  if (shorter >= 5 && x.slice(0, 2) === y.slice(0, 2) && distance(x, y) <= (shorter >= 7 ? 2 : 1)) return 'look-alike';
  return null;
}

const sameKind = (answer, candidate) => {
  const a = facts(answer), c = facts(candidate);
  return a.verb === c.verb && a.words === c.words;
};

const shownText = (word, direction) => (direction === 'he-en' ? word.english_word : word.hebrew_translation);
const shownKey = (word, direction) => (direction === 'he-en' ? core(word.english_word) : hebrewForms(word.hebrew_translation)[0] || '');

/** `count` items of `list` in random order (Fisher–Yates on a copy). */
function sample(list, count, random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/**
 * The question's options: [{ id, text, close }] in random order, the
 * answer's index, and how many close wrong options there are. `pool` is
 * every word that may be offered (the visible words).
 */
function pickOptions(answer, pool, { direction = 'en-he', random = Math.random } = {}) {
  const level = (w) => Math.abs((w.difficulty_level || 0) - (answer.difficulty_level || 0));
  const usable = pool.filter((w) => w.id !== answer.id && shownText(w, direction) && !alsoRight(answer, w));
  const chosen = [];
  const keys = new Set([shownKey(answer, direction)]);
  const take = (list, max, kind) => {
    for (const w of sample(list, list.length, random)) {
      if (chosen.length >= OPTION_COUNT - 1 || max <= 0) return;
      const k = shownKey(w, direction);
      if (!k || keys.has(k)) continue;
      keys.add(k);
      chosen.push({ word: w, close: kind });
      max--;
    }
  };
  const close = usable.filter((w) => closeness(answer, w));
  const near = close.filter((w) => level(w) <= CLOSE_LEVELS);
  take(near.length ? near : close, MAX_CLOSE, 'close');
  take(usable.filter((w) => level(w) <= FILL_LEVELS && sameKind(answer, w)), Infinity, null);
  take(usable.filter((w) => level(w) <= FILL_LEVELS), Infinity, null);
  take(usable, Infinity, null);
  const options = sample([{ word: answer, close: null }, ...chosen], OPTION_COUNT, random)
    .map(({ word, close: c }) => ({ id: word.id, text: shownText(word, direction), close: !!c }));
  return {
    options,
    answerIndex: options.findIndex((o) => o.id === answer.id),
    closeCount: chosen.filter((c) => c.close).length
  };
}

module.exports = { pickOptions, closeness, alsoRight, englishSenses, OPTION_COUNT };

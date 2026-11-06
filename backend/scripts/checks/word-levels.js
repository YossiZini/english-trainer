// Check of the vocabulary's levels (docs/words/relevel, Sprint 21):
// - every level 1-10 holds at least 100 words, spread over the alphabet
//   (at least 15 first letters: no level cut by the alphabet);
// - no pattern (as...as, sth, sb, etc), phrasal verb or phrase of three or
//   more words below level 5;
// - words get rarer: the median word frequency (proposal.csv's zipf) of
//   level 10 is below level 1's, and falls level by level from 5 to 10;
// - words.csv names the same level as vocabulary_words.json for every word,
//   and both match the approved proposal (proposal.csv's new_level).
// From backend/:  node scripts/checks/word-levels.js
// Exits 1 and lists the problems when a rule is broken.
const fs = require('fs');
const path = require('path');
const { core } = require('../../src/utils/englishAnswer');
// words.csv read the way the generator reads it.
const { parseCSVLine: fields } = require('../../src/data/generateJsonData');

const ROOT = path.join(__dirname, '../../..');
const words = require(path.join(ROOT, 'backend/data/static/vocabulary_words.json'));
const MIN_SIZE = 100;
const MIN_LETTERS = 15;
const SHAPED_FROM = 5;
const PARTICLES = new Set(['up', 'down', 'off', 'on', 'out', 'in', 'away', 'back', 'over', 'around', 'about',
  'along', 'through', 'into', 'after', 'by', 'for', 'with']);

const rowsOf = (file) => {
  const [head, ...lines] = fs.readFileSync(file, 'utf8').split('\n').filter((l) => l.trim());
  const names = fields(head);
  return lines.map((l) => Object.fromEntries(fields(l).map((v, i) => [names[i], v])));
};

/** The first sense's words, without optional parts and placeholders. */
const firstSense = (english) => core(String(english).split(/\s+\/\s+|;/)[0].replace(/\([^)]*\)/g, ' '));
const shaped = (english) => {
  const parts = firstSense(english).split(' ').filter(Boolean);
  if (/\.\.\.|…|\b(sth|sb|etc)\b/.test(english) || english.trim().startsWith('-')) return 'a pattern';
  if (parts.length >= 3) return 'a phrase of 3+ words';
  if (parts.length >= 2 && PARTICLES.has(parts[parts.length - 1])) return 'a phrasal verb';
  return null;
};
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

const problems = [];
const proposal = new Map(rowsOf(path.join(ROOT, 'docs/words/relevel/proposal.csv')).map((r) => [r.id, r]));
const csvLevel = new Map(rowsOf(path.join(ROOT, 'docs/words/words.csv'))
  .map((r) => [`${r['English Word'].trim()}::${r.Source.trim()}`, Number(r['Difficulty Level'])]));

const byLevel = new Map();
for (const w of words) {
  const level = w.difficulty_level;
  if (!byLevel.has(level)) byLevel.set(level, []);
  byLevel.get(level).push(w);
  const approved = proposal.get(w.id);
  if (!approved) problems.push(`${w.english_word}: not in proposal.csv`);
  else if (Number(approved.new_level) !== level) problems.push(`${w.english_word}: level ${level}, approved ${approved.new_level}`);
  const inCsv = csvLevel.get(`${w.english_word}::${w.source}`);
  if (inCsv !== level) problems.push(`${w.english_word}: words.csv says ${inCsv}, the JSON ${level}`);
  const shape = shaped(w.english_word);
  if (shape && level < SHAPED_FROM) problems.push(`${w.english_word}: ${shape} at level ${level}`);
}

const zipf = (w) => Number((proposal.get(w.id) || {}).zipf || 0);
const lines = ['level  words  median zipf  first letters'];
const medians = {};
for (let level = 1; level <= 10; level++) {
  const here = byLevel.get(level) || [];
  const letters = new Set(here.map((w) => firstSense(w.english_word)[0]).filter(Boolean));
  medians[level] = here.length ? median(here.map(zipf)) : 0;
  lines.push(`${String(level).padStart(5)}  ${String(here.length).padStart(5)}  ${medians[level].toFixed(2).padStart(11)}  ${letters.size}`);
  if (here.length < MIN_SIZE) problems.push(`level ${level}: ${here.length} words (fewer than ${MIN_SIZE})`);
  if (letters.size < MIN_LETTERS) problems.push(`level ${level}: words start with only ${letters.size} letters`);
}
if (!(medians[10] < medians[1])) problems.push('level 10 words are not rarer than level 1 words');
for (let level = SHAPED_FROM + 1; level <= 10; level++) {
  if (!(medians[level] < medians[level - 1])) problems.push(`level ${level}'s median frequency does not fall below level ${level - 1}'s`);
}
const others = [...byLevel.keys()].filter((l) => !(l >= 1 && l <= 10));
if (others.length) problems.push(`levels outside 1-10: ${others.join(', ')}`);

console.log(lines.join('\n'));
console.log(problems.length ? `\n${problems.length} problems:\n${problems.slice(0, 40).join('\n')}` : '\nno problems');
process.exit(problems.length ? 1 : 0);

// Check of the bot's four-choice word questions (services/bot/wordOptions.js)
// over every bundled word, in both directions, with a seeded random:
// - four options, the answer exactly once, no two options shown alike;
// - no wrong option is also right: none shares a Hebrew sense or an English
//   form with the answer (checked here with its own sense splitting);
// - how many questions get one and two close wrong options, per level.
// From backend/:  node scripts/checks/word-options.js [--examples]
// Exits 1 and lists the problems when a rule is broken.
const path = require('path');
const words = require(path.join(__dirname, '../../data/static/vocabulary_words.json'));
const { pickOptions, closeness } = require('../../src/services/bot/wordOptions');

const list = Array.isArray(words) ? words : Object.values(words).find(Array.isArray);
const NIKKUD = /[֑-ׇ]/g;

// Senses, independently: Hebrew parts split on / , ; | and "או"; English parts on " / " and ";".
const hebrewSenses = (he) => new Set(String(he).split(/[/,;|]|\s+או\s+/).map((p) => p.replace(NIKKUD, '').replace(/\([^)]*\)/g, ' ')
  .replace(/[^א-ת ]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean));
const englishSenses = (en) => new Set(String(en).toLowerCase().split(/\s+\/\s+|;/).map((p) => p.replace(/\([^)]*\)/g, ' ')
  .replace(/\b(sth|sb|something|someone|somebody|etc)\b/g, ' ').replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim()
  .replace(/^(a|an|the|to) /, '')).filter(Boolean));
const shares = (a, b) => [...a].some((x) => b.has(x));

let seed = 20261106;
const random = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };

const problems = [];
const tally = {}; // level -> [questions, with ≥1 close, with 2 close]
for (const direction of ['he-en', 'en-he']) {
  for (const word of list) {
    const { options, answerIndex, closeCount } = pickOptions(word, list, { direction, random });
    const where = `${direction} "${word.english_word}"`;
    if (options.length !== 4) problems.push(`${where}: ${options.length} options`);
    if (options.filter((o) => o.id === word.id).length !== 1 || options[answerIndex]?.id !== word.id) problems.push(`${where}: the answer is not there once`);
    const shown = options.map((o) => o.text.trim().toLowerCase());
    if (new Set(shown).size !== shown.length) problems.push(`${where}: two options look alike: ${shown.join(' | ')}`);
    for (const o of options) {
      if (o.id === word.id) continue;
      const w = list.find((x) => x.id === o.id);
      if (shares(hebrewSenses(w.hebrew_translation), hebrewSenses(word.hebrew_translation))
        || shares(englishSenses(w.english_word), englishSenses(word.english_word))) {
        problems.push(`${where}: "${w.english_word}" (${w.hebrew_translation}) is also right`);
      }
    }
    const t = (tally[word.difficulty_level] = tally[word.difficulty_level] || [0, 0, 0]);
    t[0]++; if (closeCount >= 1) t[1]++; if (closeCount >= 2) t[2]++;
  }
}

const pct = (n, d) => `${Math.round((100 * n) / d)}%`;
console.log('level  questions  ≥1 close  2 close');
let all = [0, 0, 0];
for (const [lvl, [q, one, two]] of Object.entries(tally)) {
  console.log(`${String(lvl).padStart(5)}  ${String(q).padStart(9)}  ${pct(one, q).padStart(8)}  ${pct(two, q).padStart(7)}`);
  all = [all[0] + q, all[1] + one, all[2] + two];
}
console.log(`  all  ${String(all[0]).padStart(9)}  ${pct(all[1], all[0]).padStart(8)}  ${pct(all[2], all[0]).padStart(7)}`);

if (process.argv.includes('--examples')) {
  for (const e of ['cow', 'red', 'tuesday', 'buy', 'aunt', 'bread', 'advise', 'a bit', 'learn', 'middle / in the middle', 'absolutely', 'happy']) {
    const w = list.find((x) => x.english_word.toLowerCase() === e);
    if (!w) continue;
    for (const direction of ['he-en', 'en-he']) {
      const { options } = pickOptions(w, list, { direction, random });
      console.log(`${direction} ${direction === 'he-en' ? w.hebrew_translation : w.english_word}: ${options.map((o) => `${o.text}${o.id === w.id ? ' ✓' : o.close ? ` (${closeness(w, list.find((x) => x.id === o.id))})` : ''}`).join(' | ')}`);
    }
  }
}
console.log(problems.length ? problems.slice(0, 40).join('\n') + (problems.length > 40 ? `\n… ${problems.length} problems` : '') : 'no problems');
process.exit(problems.length ? 1 : 0);

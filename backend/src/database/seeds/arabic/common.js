// Builders for the Arabic seed (topic 201): multiple-choice questions and
// lessons, with the unit's checks. Plain module; never touches a database.
const F = require('./facts');

const LEVELS = ['easy', 'medium', 'hard'];
const POSITIONAL = /(ראשונ|אחרונ|השני|השלישי|הרביעי|first|last|option \d|תשובה \d)/;

// Arabic inside Hebrew text: its own right-to-left run, in the Arabic font.
const ar = (s) => `<span class="ar" lang="ar" dir="rtl">${s}</span>`;
// Plain-text fields (questions, options) take Arabic as is: the page sets
// direction and font for the Arabic subject.

/**
 * A multiple-choice question. The answer goes at a position that varies with
 * the question number; options must be 3–4 distinct texts.
 */
function mcq(questionNumber, difficulty, questionTextHe, answer, wrongs, explanationHe) {
  const all = [answer, ...wrongs];
  if (all.length < 3 || all.length > 4) throw new Error(`Q${questionNumber}: needs 3–4 options`);
  if (new Set(all).size !== all.length) throw new Error(`Q${questionNumber}: duplicate options ${all.join(' | ')}`);
  if (all.some((o) => typeof o !== 'string' || !o.trim())) throw new Error(`Q${questionNumber}: empty option`);
  const at = questionNumber % all.length;
  const options = [...wrongs];
  options.splice(at, 0, answer);
  return {
    questionNumber, type: 'multiple_choice', questionTextHe, options, correctAnswer: answer, explanationHe, difficulty
  };
}

/** Pick `n` items of `pool` other than `except`, starting at `seed` (deterministic). */
function others(pool, except, n, seed = 0) {
  const rest = pool.filter((x) => x !== except);
  const out = [];
  for (let i = 0; out.length < n && i < rest.length * 2; i++) {
    const x = rest[(seed + i) % rest.length];
    if (!out.includes(x)) out.push(x);
  }
  if (out.length < n) throw new Error(`not enough distractors for ${except}`);
  return out;
}

/** A lesson: numbers the questions and checks 10/10/10 and the option rules. */
function lesson(meta, questions) {
  const exercises = questions.map((q, i) => ({ ...q, questionNumber: i + 1 }))
    .map((q) => mcq(q.questionNumber, q.difficulty, q.questionTextHe, q.correctAnswer, q.wrongs, q.explanationHe));
  for (const level of LEVELS) {
    const n = exercises.filter((e) => e.difficulty === level).length;
    if (n !== 10) throw new Error(`${meta.subtopicNumber}: ${n} ${level} questions (need 10)`);
  }
  const texts = new Set();
  for (const e of exercises) {
    if (texts.has(e.questionTextHe + e.correctAnswer)) throw new Error(`${meta.subtopicNumber}: repeated question "${e.questionTextHe}"`);
    texts.add(e.questionTextHe + e.correctAnswer);
    if (e.options.some((o) => POSITIONAL.test(o))) throw new Error(`${meta.subtopicNumber} Q${e.questionNumber}: an option refers to positions`);
  }
  return { ...meta, level: 'beginner', exercises };
}

/** A question spec (numbered and built by lesson()). */
const q = (difficulty, questionTextHe, correctAnswer, wrongs, explanationHe) =>
  ({ difficulty, questionTextHe, correctAnswer, wrongs, explanationHe });

// ---------------------------------------------------------------------------
// Self-check of the facts: each word's letters and vowel marks must match
// its Arabic string exactly, so no question can contradict the word.
const MARK_OF = Object.fromEntries(F.VOWELS.map((v) => [v.name, v.mark]));
for (const w of F.WORDS) {
  const built = w.letters.map(([l, v]) => l + (v ? MARK_OF[v] : '')).join('');
  if (built !== w.ar) throw new Error(`facts: ${w.ar} does not match its letters (${built})`);
}

module.exports = { ar, mcq, others, lesson, q, LEVELS };

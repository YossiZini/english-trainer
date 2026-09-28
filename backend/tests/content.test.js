const exercises = require('../data/static/exercises.json');
const lessons = require('../data/static/lessons.json');
const { choiceMatches } = require('../src/utils/answers');

/**
 * The bundled curriculum: every exercise is multiple choice (students answer
 * on a phone or in the Telegram bot, never by typing), with 3–4 distinct
 * options of which exactly one is the answer, as the grader compares it.
 */
describe('Bundled exercises', () => {
  test('every exercise is multiple choice', () => {
    const typed = exercises.filter(e => e.type !== 'multiple_choice');
    expect(typed.map(e => `${e.id} (${e.type})`)).toEqual([]);
  });

  test('3–4 distinct options, exactly one of them the answer', () => {
    const bad = [];
    for (const e of exercises) {
      const options = Array.isArray(e.options) ? e.options : [];
      const distinct = new Set(options.map(o => String(o).trim())).size === options.length;
      const matching = options.filter(o => choiceMatches(String(o), e.correct_answer)).length;
      if (options.length < 3 || options.length > 4 || !distinct || matching !== 1) {
        bad.push({ id: e.id, options, answer: e.correct_answer, matching });
      }
    }
    expect(bad).toEqual([]);
  });

  test('every exercise belongs to a lesson and has a level', () => {
    const lessonIds = new Set(lessons.map(l => l.id));
    const orphans = exercises.filter(e => !lessonIds.has(e.lesson_id) || !['easy', 'medium', 'hard'].includes(e.difficulty));
    expect(orphans.map(e => e.id)).toEqual([]);
  });
});

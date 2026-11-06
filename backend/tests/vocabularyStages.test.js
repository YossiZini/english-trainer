const fs = require('fs');
const path = require('path');
const VocabularyService = require('../src/services/vocabulary.service');
const words = require('../data/static/vocabulary_words.json');

/** The website quiz's stages on the re-levelled words (docs/words/relevel). */
describe('vocabulary quiz stages', () => {
  const stages = VocabularyService.DIFFICULTY_STAGES;

  test('three stages of about a third of the words each, one level shared with the next', () => {
    expect(stages).toEqual({ 1: { min: 1, max: 4 }, 2: { min: 4, max: 7 }, 3: { min: 7, max: 10 } });
    for (const { min, max } of Object.values(stages)) {
      const count = words.filter(w => w.difficulty_level >= min && w.difficulty_level <= max).length;
      expect(count).toBeGreaterThan(words.length / 4);
    }
  });

  test('the website shows the same ranges', () => {
    const source = fs.readFileSync(path.join(__dirname, '../../frontend/src/components/vocabulary/stages.js'), 'utf8');
    const shown = Object.fromEntries([...source.matchAll(/(\d):\s*\{\s*min:\s*(\d+),\s*max:\s*(\d+)\s*\}/g)]
      .map(([, stage, min, max]) => [stage, { min: Number(min), max: Number(max) }]));
    expect(shown).toEqual(stages);
  });
});

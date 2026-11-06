const { normalize, alternatives } = require('../src/utils/hebrewAnswer');

/** Hebrew senses of a stored translation (the bot's word options: a wrong option never shares one). */
describe('hebrewAnswer', () => {
  test('a phrase ignores spaces, punctuation and nikkud', () => {
    expect(normalize(' לגמרי  לבד. ')).toBe('לגמרי לבד');
    expect(normalize('שָׁלוֹם')).toBe('שלום');
    expect(normalize('A-B')).toBe('a b');
  });

  test('senses: the whole entry, each listed alternative, and without an optional part', () => {
    expect(alternatives('גדול / ענק, עצום')).toEqual(['גדול ענק עצום', 'גדול', 'ענק', 'עצום']);
    expect(alternatives('(לגמרי) לבד')).toEqual(['לגמרי לבד', 'לבד']);
    expect(alternatives('לאט או בהדרגה')).toEqual(['לאט או בהדרגה', 'לאט', 'בהדרגה']);
    expect(alternatives('')).toEqual([]);
  });
});

describe('pickWords', () => {
  const { pickWords } = require('../src/services/bot/wordPicker');
  const words = Array.from({ length: 30 }, (_, i) => ({ id: `w${i}` }));

  test('prefers words not yet mastered and fills up with mastered ones', () => {
    const mastered = words.slice(0, 25).map(w => w.id);
    const picked = pickWords(words, mastered, 20);
    expect(picked).toHaveLength(20);
    expect(new Set(picked.map(w => w.id)).size).toBe(20);
    const fresh = picked.filter(w => !mastered.includes(w.id));
    expect(fresh).toHaveLength(5);
  });

  test('returns fewer when there are not enough candidates', () => {
    expect(pickWords(words.slice(0, 3), [], 20)).toHaveLength(3);
  });
});

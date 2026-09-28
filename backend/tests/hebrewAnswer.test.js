const { normalize, alternatives, hebrewAnswerMatches } = require('../src/utils/hebrewAnswer');

describe('hebrewAnswerMatches', () => {
  test('ignores spaces, punctuation and nikkud', () => {
    expect(hebrewAnswerMatches(' לגמרי  לבד. ', 'לגמרי לבד')).toBe(true);
    expect(hebrewAnswerMatches('שָׁלוֹם', 'שלום')).toBe(true);
    expect(hebrewAnswerMatches('בית', 'בית ספר')).toBe(false);
  });

  test('accepts any listed alternative and an optional parenthesised part', () => {
    expect(alternatives('גדול / ענק, עצום')).toEqual(['גדול', 'ענק', 'עצום']);
    expect(hebrewAnswerMatches('ענק', 'גדול / ענק')).toBe(true);
    expect(hebrewAnswerMatches('לבד', '(לגמרי) לבד')).toBe(true);
    expect(hebrewAnswerMatches('לגמרי לבד', '(לגמרי) לבד')).toBe(true);
    expect(hebrewAnswerMatches('מהר', 'לאט או בהדרגה')).toBe(false);
    expect(hebrewAnswerMatches('בהדרגה', 'לאט או בהדרגה')).toBe(true);
  });

  test('empty or unrelated text never matches', () => {
    expect(hebrewAnswerMatches('', 'שלום')).toBe(false);
    expect(hebrewAnswerMatches('   ', 'שלום')).toBe(false);
    expect(normalize('A-B')).toBe('a b');
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

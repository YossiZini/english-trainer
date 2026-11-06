const { pickOptions, closeness, alsoRight, englishSenses } = require('../src/services/bot/wordOptions');

const W = (id, english_word, hebrew_translation, difficulty_level = 2, extra = {}) =>
  ({ id, english_word, hebrew_translation, difficulty_level, ...extra });

// A small pool: groups, an opposite, a family, a look-alike, synonyms and fillers.
const POOL = [
  W('cow', 'cow', 'פרה'), W('horse', 'horse', 'סוס'), W('donkey', 'donkey', 'חמור'),
  W('bit', 'a bit', 'קצת'), W('little', 'a little', 'קצת / מעט'), W('much', 'much', 'הרבה'),
  W('learn', 'learn', 'ללמוד'), W('study', 'study', 'ללמוד / מחקר'), W('think', 'think', 'לחשוב'),
  W('buy', 'buy', 'לקנות'), W('sell', 'sell', 'למכור'), W('run', 'run', 'לרוץ'),
  W('light1', 'light', 'אור'), W('light2', 'light', 'קל (משקל)'), W('lamp', 'lamp', 'מנורה'),
  W('advise', 'advise', 'לייעץ'), W('advice', 'advice', 'עצה'),
  W('bread', 'bread', 'לחם'), W('break', 'break', 'לשבור'),
  W('table', 'table', 'שולחן'), W('green', 'green', 'ירוק'), W('school', 'school', 'בית ספר'),
  W('far', 'far away', 'רחוק מאוד', 9)
];
let seed = 7;
const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const byId = (id) => POOL.find((w) => w.id === id);

describe('wordOptions: what is close, what is also right', () => {
  test('a group, an opposite, a family and a look-alike are close; unrelated words are not', () => {
    expect(closeness(byId('cow'), byId('horse'))).toBe('group');
    expect(closeness(byId('buy'), byId('sell'))).toBe('group'); // also opposites; the group is found first
    expect(closeness(W('a', 'absolute', 'מוחלט'), W('b', 'absolutely', 'בהחלט'))).toBe('family');
    expect(closeness(byId('advise'), byId('advice'))).toBe('look-alike');
    expect(closeness(byId('bread'), byId('break'))).toBe('look-alike');
    expect(closeness(byId('cow'), byId('table'))).toBeNull();
    expect(closeness(W('a', 'heavy', 'כבד'), W('b', 'light', 'קל'))).toBe('opposite');
  });

  test('a synonym, an entry with the same English, or an accepted alternative is also right', () => {
    expect(alsoRight(byId('bit'), byId('little'))).toBe(true); // קצת is one of the senses of a little
    expect(alsoRight(byId('learn'), byId('study'))).toBe(true); // ללמוד
    expect(alsoRight(byId('light1'), byId('light2'))).toBe(true); // the same English: its Hebrew is right too
    expect(alsoRight(W('x', 'answer', 'תשובה', 2, { english_alternatives: ['reply'] }), W('y', 'reply', 'מענה'))).toBe(true);
    // Either word's accepted alternative counts: a review accepted "big" for "large" (רחב).
    expect(alsoRight(W('b', 'big', 'גדול'), W('l', 'large', 'רחב', 2, { english_alternatives: ['big'] }))).toBe(true);
    // A review that adds an alternative later is seen (not a stale cached answer).
    expect(alsoRight(W('b', 'big', 'גדול'), W('l2', 'vast', 'עצום'))).toBe(false);
    expect(alsoRight(W('b', 'big', 'גדול'), W('l2', 'vast', 'עצום', 2, { english_alternatives: ['big'] }))).toBe(true);
    expect(alsoRight(byId('cow'), byId('horse'))).toBe(false);
  });

  test('English senses split a spaced slash and ";", not a slash inside a word', () => {
    expect([...englishSenses('middle / in the middle')].sort()).toEqual(['in the middle', 'middle']);
    expect(englishSenses('carry on sth / carry sth on').has('carry on')).toBe(true);
    expect([...englishSenses('adviser/advisor')].sort()).toEqual(expect.arrayContaining(['adviser', 'advisor']));
  });
});

describe('wordOptions: the four options of a question', () => {
  test('four options, the answer once at answerIndex, all shown differently', () => {
    for (const w of POOL) {
      for (const direction of ['he-en', 'en-he']) {
        const { options, answerIndex } = pickOptions(w, POOL, { direction, random });
        expect(options).toHaveLength(4);
        expect(options.filter((o) => o.id === w.id)).toHaveLength(1);
        expect(options[answerIndex].id).toBe(w.id);
        expect(new Set(options.map((o) => o.text)).size).toBe(4);
        for (const o of options) if (o.id !== w.id) expect(alsoRight(w, byId(o.id))).toBe(false);
      }
    }
  });

  test('he-en shows English options, en-he Hebrew ones', () => {
    const he = pickOptions(byId('cow'), POOL, { direction: 'he-en', random });
    expect(he.options.find((o) => o.id === 'cow').text).toBe('cow');
    const en = pickOptions(byId('cow'), POOL, { direction: 'en-he', random });
    expect(en.options.find((o) => o.id === 'cow').text).toBe('פרה');
  });

  test('close options come first: cow gets both other animals', () => {
    for (let i = 0; i < 20; i++) {
      const { options, closeCount } = pickOptions(byId('cow'), POOL, { direction: 'he-en', random });
      expect(closeCount).toBe(2);
      expect(options.map((o) => o.id)).toEqual(expect.arrayContaining(['horse', 'donkey']));
    }
  });

  test('a synonym is never offered: a bit never shows a little; learn never shows study', () => {
    for (let i = 0; i < 30; i++) {
      expect(pickOptions(byId('bit'), POOL, { direction: 'he-en', random }).options.map((o) => o.id)).not.toContain('little');
      expect(pickOptions(byId('learn'), POOL, { direction: 'en-he', random }).options.map((o) => o.id)).not.toContain('study');
      expect(pickOptions(byId('light1'), POOL, { direction: 'en-he', random }).options.map((o) => o.id)).not.toContain('light2');
    }
  });

  test('a verb gets verbs as fillers when it has no close words left (by the Hebrew ל)', () => {
    const verbs = new Set(['learn', 'think', 'buy', 'sell', 'run', 'advise', 'break', 'study']);
    const { options } = pickOptions(byId('run'), POOL, { direction: 'he-en', random });
    expect(options.every((o) => verbs.has(o.id))).toBe(true);
  });
});

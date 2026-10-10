import { TIERS, assessmentFor, fixedSummary } from './assessment';

describe('words instead of a score at the end of a test', () => {
  test('the top line is kept for a test with every answer right', () => {
    expect(assessmentFor(10, 10).tone).toBe('perfect');
    expect(assessmentFor(199, 200).tone).toBe('excellent');
  });

  test('the better it went, the stronger the words', () => {
    let previous = TIERS.length - 1;
    for (let correct = 0; correct <= 100; correct += 1) {
      const index = TIERS.indexOf(assessmentFor(correct, 100));
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThanOrEqual(previous);
      previous = index;
    }
    const reached = new Set(Array.from({ length: 101 }, (_, correct) => assessmentFor(correct, 100).tone));
    expect(reached.size).toBe(TIERS.length);
  });

  test('"good" and above line up with the pass mark of 70, rounded as the API does', () => {
    const passed = ['perfect', 'excellent', 'great', 'good'];
    expect(passed).toContain(assessmentFor(7, 10).tone);
    expect(passed).not.toContain(assessmentFor(6, 10).tone);
    expect(passed).toContain(assessmentFor(23, 33).tone); // 69.7 rounds to 70
  });

  test('no questions or missing numbers still get kind words', () => {
    expect(assessmentFor(0, 0).tone).toBe('first');
    expect(assessmentFor(undefined, undefined).tone).toBe('first');
    expect(assessmentFor(0, 10).text).toBeTruthy();
  });

  test('words only, always kind, each tier its own title', () => {
    TIERS.forEach(({ icon, title, text }) => {
      expect(icon).toBeTruthy();
      expect(`${title} ${text}`).not.toMatch(/[0-9%]/);
      expect(`${title} ${text}`).not.toMatch(/ציון|שגוי|נכשל|לא נכון|טעיתם|גרוע|חלש/);
    });
    expect(new Set(TIERS.map((tier) => tier.title)).size).toBe(TIERS.length);
  });
});

describe('what a mistakes exam fixed', () => {
  test('fixed now and still waiting, singular for one', () => {
    expect(fixedSummary(3, 5)).toBe('תיקנתם 3 טעויות; עוד 5 טעויות מחכות לסיבוב הבא.');
    expect(fixedSummary(1, 1)).toBe('תיקנתם טעות אחת; עוד טעות אחת מחכה לסיבוב הבא.');
    expect(fixedSummary(0, 4)).toBe('עוד 4 טעויות מחכות לסיבוב הבא.');
  });

  test('nothing left: all fixed', () => {
    expect(fixedSummary(2, 0)).toBe('תיקנתם 2 טעויות – כל הטעויות תוקנו! 🎉');
    expect(fixedSummary(1, 0)).toBe('תיקנתם טעות אחת – כל הטעויות תוקנו! 🎉');
  });
});

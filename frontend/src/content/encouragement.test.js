import { LINES, STREAK, STREAK_LINES, lineFor, encouragementFor, resetEncouragement } from './encouragement';

describe('encouragement for a wrong answer', () => {
  beforeEach(resetEncouragement);

  test('two wrong answers in a row never get the same line', () => {
    const lines = Array.from({ length: 40 }, (_, i) => lineFor(i + 1, 1));
    lines.slice(1).forEach((line, i) => expect(line).not.toBe(lines[i]));
  });

  test('a streak of wrong answers gets more cheer; a right answer resets it', () => {
    expect(LINES).toContain(encouragementFor('q1', false));
    expect(LINES).toContain(encouragementFor('q2', false));
    expect(STREAK_LINES).toContain(encouragementFor('q3', false));
    expect(encouragementFor('q4', true)).toBeNull();
    expect(LINES).toContain(encouragementFor('q5', false));
    expect(STREAK).toBe(3);
  });

  test('showing the same question again keeps its line', () => {
    const first = encouragementFor('q1', false);
    encouragementFor('q2', false);
    expect(encouragementFor('q1', false)).toBe(first);
  });

  test('the lines are short and never say "wrong"', () => {
    [...LINES, ...STREAK_LINES].forEach(({ icon, text }) => {
      expect(icon).toBeTruthy();
      expect(text.length).toBeLessThanOrEqual(26);
      expect(text).not.toMatch(/לא נכון|שגוי|טעיתם/);
    });
  });
});

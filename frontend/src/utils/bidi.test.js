import { textDirection, isolateEnglish } from './bidi';

const ltrParts = (text) => isolateEnglish(text).filter(p => p.ltr).map(p => p.text);

describe('textDirection', () => {
  test('follows the first letter', () => {
    expect(textDirection('She _______ (can) play the guitar.')).toBe('ltr');
    expect(textDirection('_______ you speak English? (שאלת כן/לא)')).toBe('ltr');
    expect(textDirection('המילה "quickly" היא _______')).toBe('rtl');
    expect(textDirection('"Hello" ...')).toBe('ltr');
    expect(textDirection('3/4 + 1/4 = ?')).toBe('ltr');
    expect(textDirection('')).toBe('ltr');
  });
});

describe('isolateEnglish', () => {
  test('an English sentence after a Hebrew instruction keeps its blank and final period', () => {
    expect(ltrParts('בחרו את הכתיב הנכון: We sailed across _______.')).toEqual(['We sailed across _______.']);
    expect(ltrParts('תקן: She is wanting a new car. → She _______ a new car.'))
      .toEqual(['She is wanting a new car. → She _______ a new car.']);
  });

  test('a quoted English word keeps its quotes; the Hebrew question mark stays outside', () => {
    expect(ltrParts('מהו חלק הדיבור של המילה "book"?')).toEqual(['"book"']);
    expect(ltrParts('המילה "quickly" היא _______')).toEqual(['"quickly"']);
  });

  test('a quoted sentence inside Hebrew leaves the Hebrew comma outside', () => {
    expect(ltrParts('במשפט "She is beautiful", המילה "beautiful" היא _______'))
      .toEqual(['"She is beautiful"', '"beautiful"']);
  });

  test('parts put back together are the original text', () => {
    for (const t of ['הפוך לשאלת מידע: "Is he tall?" → "_______ tall is he?"',
      'כדי להראות שייכות, משתמשים ב_______\'s', 'משפט השואל שאלה נקרא _______ sentence',
      'תקן: "I like the cats." (במשמעות כללית) → I like _______.']) {
      expect(isolateEnglish(t).map(p => p.text).join('')).toBe(t);
    }
    expect(ltrParts('הפוך לשאלת מידע: "Is he tall?" → "_______ tall is he?"'))
      .toEqual(['"Is he tall?" → "_______ tall is he?"']);
    expect(ltrParts('משפט השואל שאלה נקרא _______ sentence')).toEqual(['sentence']);
  });
});

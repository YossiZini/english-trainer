const { mathLesson, eq, withQuestionPicture, optionsQuestion } = require('../src/database/seeds/multiplication/common');

/**
 * The one lesson builder of the math chapters built from the multiplication
 * helpers (1, 2 and 7 on): the checks each chapter turns on, and the fields
 * every lesson gets.
 */
describe('mathLesson, the shared math lesson builder', () => {
  const q = (n, difficulty, extra = {}) => ({
    questionNumber: n, difficulty, questionTextHe: 'כמה זה?', explanationHe: 'כי.', options: ['1', '2', '3'], ...extra
  });
  const thirty = (extra = {}) => ['easy', 'medium', 'hard'].flatMap((d, l) =>
    Array.from({ length: 10 }, (_, i) => q(l * 10 + i + 1, d, i === 0 && l === 0 ? extra : {})));

  test('a lesson: its topic, number, place in the order, and equations glued to one line', () => {
    const lesson = mathLesson({ topic: 109, order: 1090 }, 2, 'One step', 'צעד אחד',
      `<p>${eq('x + 5 = 12')}</p>`, thirty({ explanationPicture: '<span dir="ltr">3 + 4 = 7</span>' }));
    expect(lesson).toMatchObject({ topicNumber: 109, subtopicNumber: '109.2', orderIndex: 1092, titleHe: 'צעד אחד', level: 'beginner' });
    expect(lesson.theoryContentHe).toBe('<p><span dir="ltr">x + 5 = 12</span></p>');
    expect(lesson.exercises[0].explanationPicture).toBe('<span dir="ltr">3 + 4 = 7</span>');
    expect(lesson.exercises).toHaveLength(30);
  });

  test('oneLine marks every equation span, glued, of the theory and the pictures; without it nothing changes', () => {
    const theory = `<p>${eq('0.7 = 7/10')} ו-${eq('0.5')}</p>`;
    const picture = '<figcaption dir="auto"><span dir="ltr">3/10 = 0.3</span></figcaption>';
    const marked = mathLesson({ topic: 110, order: 1010, oneLine: true }, 1, 'Tenths', 'עשיריות', theory, thirty({ explanationPicture: picture }));
    expect(marked.theoryContentHe).toBe('<p><span dir="ltr" class="math-line">0.7 = 7/10</span> ו-<span dir="ltr" class="math-line">0.5</span></p>');
    expect(marked.exercises[0].explanationPicture).toBe('<figcaption dir="auto"><span dir="ltr" class="math-line">3/10 = 0.3</span></figcaption>');
    const plain = mathLesson({ topic: 110, order: 1010 }, 1, 'Tenths', 'עשיריות', theory, thirty({ explanationPicture: picture }));
    expect(plain.theoryContentHe).toBe('<p><span dir="ltr">0.7 = 7/10</span> ו-<span dir="ltr">0.5</span></p>');
    expect(() => mathLesson({ topic: 110, order: 1010, oneLine: 'yes' }, 1, 'T', 'ע', '', thirty())).toThrow('oneLine must be true or false');
  });

  test('10 questions per level, or no lesson', () => {
    const short = thirty().slice(1);
    expect(() => mathLesson({ topic: 109, order: 1090 }, 1, 'Short', 'קצר', '', short)).toThrow('109.1 Short: 9 easy exercises, expected 10');
  });

  test('options never mix Hebrew with digits, or with Latin letters when the chapter asks', () => {
    const digits = thirty({ options: ['שניהם 8', '2', '3'] });
    expect(() => mathLesson({ topic: 109, order: 1090, options: 'digits' }, 1, 'A', 'א', '', digits)).toThrow('option mixes Hebrew with numbers: שניהם 8');
    const letter = thirty({ options: ['ציר x', '2', '3'] });
    expect(() => mathLesson({ topic: 109, order: 1090, options: 'digits' }, 1, 'A', 'א', '', letter)).not.toThrow();
    expect(() => mathLesson({ topic: 109, order: 1090, options: 'letters' }, 1, 'A', 'א', '', letter)).toThrow('option mixes Hebrew with numbers or letters: ציר x');
    // Off unless asked: chapters 1 and 2 keep their options as they are.
    expect(() => mathLesson({ topic: 109, order: 1090 }, 1, 'A', 'א', '', digits)).not.toThrow();
  });

  test('no quote mark in a question or explanation when the chapter asks (ס״מ takes ״)', () => {
    const quoted = thirty({ questionTextHe: 'אורך 5 ס"מ' });
    expect(() => mathLesson({ topic: 109, order: 1090, noQuote: true }, 1, 'A', 'א', '', quoted)).toThrow('109.1 q1: a quote mark');
    expect(() => mathLesson({ topic: 109, order: 1090, noQuote: true }, 1, 'A', 'א', '', thirty({ questionTextHe: 'אורך 5 ס״מ' }))).not.toThrow();
    // 'units': only a quote mark inside a Hebrew word; a quoted question is fine.
    expect(() => mathLesson({ topic: 109, order: 1090, noQuote: 'units' }, 1, 'A', 'א', '', quoted)).toThrow('109.1 q1: a quote mark');
    const quoting = thirty({ explanationHe: 'עונה על "כמה נשארו".' });
    expect(() => mathLesson({ topic: 109, order: 1090, noQuote: 'units' }, 1, 'A', 'א', '', quoting)).not.toThrow();
    expect(() => mathLesson({ topic: 109, order: 1090, noQuote: true }, 1, 'A', 'א', '', quoting)).toThrow('a quote mark');
  });

  test('eq keeps < and > from ending the span; a question picture only when there is one', () => {
    expect(eq('−8 < −2')).toBe('<span dir="ltr">−8 &lt; −2</span>');
    expect(withQuestionPicture({ id: 1 }, '<svg/>')).toEqual({ id: 1, questionPicture: '<svg/>' });
    expect(withQuestionPicture({ id: 1 }, null)).toEqual({ id: 1 });
  });

  test('a misspelt check is refused, not turned off', () => {
    expect(() => mathLesson({ topic: 109, order: 1090, noQuote: 'unit' }, 1, 'A', 'א', '<p></p>', thirty()))
      .toThrow("noQuote must be true, false or 'units'");
    expect(() => mathLesson({ topic: 109, order: 1090, options: 'digit' }, 1, 'A', 'א', '<p></p>', thirty()))
      .toThrow("options must be 'digits' or 'letters'");
  });

  test('the quote check reads the options too', () => {
    expect(() => mathLesson({ topic: 109, order: 1090, noQuote: 'units' }, 1, 'A', 'א', '<p></p>', thirty({ options: ['100 ס"מ', '2', '3'] })))
      .toThrow('a quote mark');
  });
});

describe('optionsQuestion, the builder that takes pictures as { picture, question }', () => {
  test('the pictures land on the exercise', () => {
    const e = optionsQuestion(1, 'easy', 'כמה?', '7', ['1', '2', '3'], 'כי.', { picture: '<svg/>', question: '/q.png' });
    expect(e.explanationPicture).toBe('<svg/>');
    expect(e.questionPicture).toBe('/q.png');
    expect(optionsQuestion(2, 'easy', 'כמה?', '7', ['1', '2', '3'], 'כי.').questionPicture).toBeUndefined();
  });

  test('a picture passed in place of the options, or an unknown option, is refused', () => {
    expect(() => optionsQuestion(3, 'easy', 'כמה?', '7', ['1', '2', '3'], 'כי.', '<svg/>')).toThrow('pass pictures as { picture, question }');
    expect(() => optionsQuestion(4, 'easy', 'כמה?', '7', ['1', '2', '3'], 'כי.', { pictur: '<svg/>' })).toThrow('unknown option pictur');
  });
});

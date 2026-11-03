import { render } from '@testing-library/react';
import MultipleChoice from './MultipleChoice';

const question = (extra = {}) => ({
  id: 'q1',
  type: 'multiple_choice',
  question_text_he: 'מה השיעורים של הנקודה A?',
  options: ['(2, 3)', '(3, 2)', '(−2, 3)', '(2, −3)'],
  ...extra
});

describe('MultipleChoice: a question with its own picture', () => {
  test('the picture is shown between the question and the options', () => {
    const svg = '<svg class="math-pic" aria-label="מערכת צירים"><circle cx="1" cy="1" r="1"/></svg>';
    const { container } = render(
      <MultipleChoice question={question({ question_picture: svg })} selectedAnswer="(2, 3)" onAnswerChange={() => {}} feedback={null} subject="math" />
    );
    const picture = container.querySelector('.question-picture');
    expect(picture).not.toBeNull();
    expect(picture.querySelector('svg[aria-label="מערכת צירים"]')).not.toBeNull();
    const text = container.querySelector('.question-text');
    const options = container.querySelector('.options-container');
    // Document order: question, picture, options.
    expect(text.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(picture.compareDocumentPosition(options) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('a question without a picture shows none', () => {
    const { container } = render(
      <MultipleChoice question={question()} selectedAnswer="(2, 3)" onAnswerChange={() => {}} feedback={null} subject="math" />
    );
    expect(container.querySelector('.question-picture')).toBeNull();
  });
});

describe('MultipleChoice: each option reads in its own direction', () => {
  const render3 = (subject, options) => render(
    <MultipleChoice question={question({ options })} selectedAnswer={null} onAnswerChange={() => {}} feedback={null} subject={subject} />
  ).container;

  test('a Hebrew option that starts with a fraction is laid out right to left, aligned like the rest', () => {
    const c = render3('math', ['3/4 הוא יותר משלם', '3/4 שווה ל-4/3', '(2, −3)', 'goes']);
    const texts = [...c.querySelectorAll('.option-text')];
    // dir="auto": the first strong letter decides, so Hebrew reads right to left and numbers or English left to right.
    expect(texts.map((t) => t.getAttribute('dir'))).toEqual(['auto', 'auto', 'auto', 'auto']);
    expect([...c.querySelectorAll('.option')].every((o) => o.getAttribute('dir') === 'ltr')).toBe(true);
  });

  test('Arabic options keep the right-to-left box as they were', () => {
    const c = render3('arabic', ['ب', 'ت', 'ث', 'ن']);
    expect([...c.querySelectorAll('.option-text')].every((t) => !t.hasAttribute('dir'))).toBe(true);
    expect([...c.querySelectorAll('.option')].every((o) => o.getAttribute('dir') === 'rtl')).toBe(true);
  });
});

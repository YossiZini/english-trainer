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

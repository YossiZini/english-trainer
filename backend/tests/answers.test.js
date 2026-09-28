const { answersMatch, choiceMatches, isCorrectAnswer, parseNumber } = require('../src/utils/answers');

describe('choiceMatches and isCorrectAnswer', () => {
  const capitals = { type: 'multiple_choice', correct_answer: 'I like pizza' };

  test('a chosen option must be the answer exactly: case is part of it', () => {
    expect(choiceMatches('I like pizza', 'I like pizza')).toBe(true);
    expect(choiceMatches(' I like pizza ', 'I like pizza')).toBe(true);
    expect(choiceMatches('i like pizza', 'I like pizza')).toBe(false);
    expect(isCorrectAnswer(capitals, 'I Like Pizza')).toBe(false);
    expect(isCorrectAnswer(capitals, 'I like pizza')).toBe(true);
  });

  test('numeric options still compare by value', () => {
    expect(choiceMatches('6/8', '3/4')).toBe(true);
    expect(choiceMatches('25%', '25')).toBe(true);
    expect(choiceMatches('2/3', '3/4')).toBe(false);
  });

  test('a typed answer keeps the lenient comparison', () => {
    expect(isCorrectAnswer({ type: 'fill_in_blank', correct_answer: 'Is' }, ' is ')).toBe(true);
    expect(isCorrectAnswer({ correct_answer: 'Is' }, 'is')).toBe(true);
    expect(choiceMatches(undefined, 'is')).toBe(false);
  });
});

describe('answersMatch', () => {
  test('text answers compare trimmed and case-insensitively', () => {
    expect(answersMatch(' Is ', 'is')).toBe(true);
    expect(answersMatch('is', 'are')).toBe(false);
    expect(answersMatch('חילוק', 'חילוק')).toBe(true);
  });

  test('fractions, decimals and mixed numbers compare by value', () => {
    expect(answersMatch('0.75', '3/4')).toBe(true);
    expect(answersMatch('6/8', '3/4')).toBe(true);
    expect(answersMatch('1.5', '1 1/2')).toBe(true);
    expect(answersMatch('3/2', '1 1/2')).toBe(true);
    expect(answersMatch('7,5', '7.5')).toBe(true);
    expect(answersMatch('2/3', '3/4')).toBe(false);
  });

  test('percent and currency signs, signs and spaces are ignored', () => {
    expect(answersMatch('25%', '25')).toBe(true);
    expect(answersMatch('90 ₪', '90')).toBe(true);
    expect(answersMatch('-7', '−7')).toBe(true);
    expect(answersMatch(' 3 / 4 ', '3/4')).toBe(true);
  });

  test('non-numeric text never equals a number', () => {
    expect(answersMatch('three', '3')).toBe(false);
    expect(answersMatch('3/0', '3')).toBe(false);
    expect(answersMatch('', '3')).toBe(false);
    expect(answersMatch(undefined, '3')).toBe(false);
  });

  test('parseNumber', () => {
    expect(parseNumber('1 1/2')).toBe(1.5);
    expect(parseNumber('12.5%')).toBe(12.5);
    expect(parseNumber('is')).toBeNull();
    expect(parseNumber('1/2/3')).toBeNull();
  });
});

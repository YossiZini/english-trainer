const { alternatives, maskAnswer } = require('../src/utils/englishAnswer');

/** English forms of a stored entry (the bot's word options) and the "?" hint sentence. */
describe('englishAnswer', () => {
  test('forms ignore case, spaces, punctuation and a leading a/an/the/to', () => {
    expect(alternatives('  House. ')).toEqual(['house']);
    expect(alternatives('a house')).toEqual(['house']);
    expect(alternatives('to run')).toEqual(['run']);
    expect(alternatives('well-known')).toEqual(['well known']);
    expect(alternatives('don’t worry')).toEqual(["don't worry"]);
  });

  test('forms expand listed alternatives, optional parts and placeholders', () => {
    expect(alternatives('adviser/advisor')).toEqual(['adviser', 'advisor']);
    expect(alternatives('a sharp rise/increase/drop, etc.')).toEqual(['sharp rise', 'sharp increase', 'sharp drop']);
    expect(alternatives('(at) any minute; any minute now')).toEqual(['at any minute', 'any minute', 'any minute now']);
    expect(alternatives('(just) in case')).toEqual(['just in case', 'in case']);
    expect(alternatives('about to do sth')).toEqual(['about to do']);
    expect(alternatives('a bit')).toEqual(['bit']);
  });

  test('the example sentence hides the answer, or is withheld when it cannot', () => {
    expect(maskAnswer('Thanks for the invitation.', 'invitation')).toBe('Thanks for the _____.');
    expect(maskAnswer('She invited all her friends.', 'to invite')).toBe('She _____ all her friends.');
    expect(maskAnswer('A sharp drop in prices.', 'a sharp rise/increase/drop, etc.')).toBe('A _____ _____ in prices.');
    expect(maskAnswer('I bought a car.', 'buy')).toBeNull(); // irregular form: no hint rather than the answer
    expect(maskAnswer(null, 'buy')).toBeNull();
  });
});

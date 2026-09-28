import { continueTarget } from './continueTarget';

const next = { id: 'L2', title_he: 'שיעור 2' };
const last = (difficulty) => ({ lesson_id: 'L1', title_he: 'שיעור 1', difficulty, score: 70 });

describe('continueTarget', () => {
  test('no activity: the next lesson', () => {
    expect(continueTarget(next, null)).toEqual({ kind: 'lesson', lessonId: 'L2', title: 'שיעור 2', difficulty: null, path: '/learn/L2' });
  });

  test('after easy or medium: the next difficulty of the same lesson', () => {
    expect(continueTarget(next, last('easy'))).toMatchObject({ kind: 'exercise', lessonId: 'L1', difficulty: 'medium', path: '/exercise/L1?difficulty=medium' });
    expect(continueTarget(next, last('medium'))).toMatchObject({ kind: 'exercise', difficulty: 'hard' });
    expect(continueTarget(next, last(undefined))).toMatchObject({ kind: 'exercise', difficulty: 'medium' });
  });

  test('after hard: the next lesson; nothing left: done', () => {
    expect(continueTarget(next, last('hard'))).toMatchObject({ kind: 'lesson', lessonId: 'L2' });
    expect(continueTarget(null, last('hard'))).toEqual({ kind: 'done' });
    expect(continueTarget(null, null)).toEqual({ kind: 'done' });
  });
});

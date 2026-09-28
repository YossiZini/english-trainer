// Where a subject's "continue" button leads, from that subject's next
// lesson and its last exercise result (both from the dashboard API):
// the next difficulty of the lesson last practised (easy -> medium -> hard),
// else the next lesson, else nothing left.

export const DIFFICULTIES = ['easy', 'medium', 'hard'];
export const DIFFICULTY_LABELS = { easy: 'קל', medium: 'בינוני', hard: 'מתקדם' };

export function continueTarget(nextLesson, lastActivity) {
  if (lastActivity) {
    const index = DIFFICULTIES.indexOf(lastActivity.difficulty || 'easy');
    if (index >= 0 && index < DIFFICULTIES.length - 1) {
      const difficulty = DIFFICULTIES[index + 1];
      return {
        kind: 'exercise',
        lessonId: lastActivity.lesson_id,
        title: lastActivity.title_he,
        difficulty,
        path: `/exercise/${lastActivity.lesson_id}?difficulty=${difficulty}`
      };
    }
  }
  if (nextLesson) {
    return { kind: 'lesson', lessonId: nextLesson.id, title: nextLesson.title_he, difficulty: null, path: `/learn/${nextLesson.id}` };
  }
  return { kind: 'done' };
}

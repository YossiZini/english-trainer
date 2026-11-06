/**
 * The vocabulary quiz's three stages: word levels, one level shared with the
 * next stage. The API holds the same ranges (DIFFICULTY_STAGES in
 * backend/src/services/vocabulary.service.js); keep the two equal. Each
 * stage is about a third of the words, on the levels of docs/words/relevel.
 */
export const STAGES = {
  1: { min: 1, max: 4 },
  2: { min: 4, max: 7 },
  3: { min: 7, max: 10 }
};

/** "1-4": a stage's word levels, as the pages show them. */
export const stageRange = (stage) => `${STAGES[stage].min}-${STAGES[stage].max}`;

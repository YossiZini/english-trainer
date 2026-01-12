-- Add difficulty column to exercise_results table
-- This allows tracking of which difficulty level each exercise attempt was

ALTER TABLE exercise_results
ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50) DEFAULT 'easy';

-- Add constraint to ensure only valid difficulty values
ALTER TABLE exercise_results
DROP CONSTRAINT IF EXISTS check_difficulty_values;

ALTER TABLE exercise_results
ADD CONSTRAINT check_difficulty_values
CHECK (difficulty IN ('easy', 'medium', 'hard'));

-- Create index for better query performance when filtering by difficulty
CREATE INDEX IF NOT EXISTS idx_exercise_results_difficulty
ON exercise_results(user_id, lesson_id, difficulty);

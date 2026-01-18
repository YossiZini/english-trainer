-- Vocabulary Learning System Migration
-- Creates tables for vocabulary quiz feature with difficulty progression and review mode

-- Table 1: Store vocabulary words from CSV
CREATE TABLE IF NOT EXISTS vocabulary_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english_word VARCHAR(255) NOT NULL,
  hebrew_translation TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
  source VARCHAR(100) NOT NULL,
  sentence_en TEXT,
  sentence_he TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(english_word, source)
);

CREATE INDEX idx_vocabulary_words_difficulty ON vocabulary_words(difficulty_level);
CREATE INDEX idx_vocabulary_words_source ON vocabulary_words(source);

-- Table 2: Track user answer history (correct/incorrect responses)
CREATE TABLE IF NOT EXISTS vocabulary_user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  quiz_session_id UUID,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vocab_history_user ON vocabulary_user_history(user_id);
CREATE INDEX idx_vocab_history_word ON vocabulary_user_history(word_id);
CREATE INDEX idx_vocab_history_session ON vocabulary_user_history(quiz_session_id);
CREATE INDEX idx_vocab_history_correct ON vocabulary_user_history(user_id, is_correct);

-- Table 3: Track quiz sessions
CREATE TABLE IF NOT EXISTS vocabulary_quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_type VARCHAR(50) NOT NULL DEFAULT 'regular',  -- 'regular' or 'review'
  quiz_size INTEGER NOT NULL,
  difficulty_range_start INTEGER NOT NULL,
  difficulty_range_end INTEGER NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  consecutive_correct INTEGER DEFAULT 0,       -- Track streak for difficulty progression
  current_difficulty_stage INTEGER DEFAULT 1,  -- 1: easy (1-3), 2: medium (3-5), 3: hard (5-10)
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'in_progress'     -- 'in_progress', 'completed', 'abandoned'
);

CREATE INDEX idx_vocab_sessions_user ON vocabulary_quiz_sessions(user_id);
CREATE INDEX idx_vocab_sessions_status ON vocabulary_quiz_sessions(status);
CREATE INDEX idx_vocab_sessions_completed ON vocabulary_quiz_sessions(completed_at);

-- Table 4: Track failed words for review mode
CREATE TABLE IF NOT EXISTS vocabulary_failed_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  fail_count INTEGER DEFAULT 1,
  last_failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_in_session_id UUID REFERENCES vocabulary_quiz_sessions(id),
  is_pending_review BOOLEAN DEFAULT TRUE,       -- TRUE until successfully reviewed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, word_id)
);

CREATE INDEX idx_vocab_failed_user ON vocabulary_failed_words(user_id);
CREATE INDEX idx_vocab_failed_pending ON vocabulary_failed_words(user_id, is_pending_review);

-- Table 5: Track user vocabulary statistics
CREATE TABLE IF NOT EXISTS vocabulary_user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  accumulated_fails INTEGER DEFAULT 0,          -- Current fail count (resets after review)
  total_words_learned INTEGER DEFAULT 0,        -- Words answered correctly at least once
  total_quizzes_completed INTEGER DEFAULT 0,
  total_review_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vocab_stats_user ON vocabulary_user_stats(user_id);

-- Add vocabulary achievements
INSERT INTO achievements (
  id,
  key,
  name_en,
  name_he,
  description_en,
  description_he,
  icon,
  category,
  points_reward,
  requirement_type,
  requirement_value,
  created_at
) VALUES
(
  gen_random_uuid(),
  'vocab_first_quiz',
  'Word Warrior',
  'לוחם המילים',
  'Complete your first vocabulary quiz',
  'השלם את חידון המילים הראשון שלך',
  '📝',
  'vocabulary',
  10,
  'quizzes_completed',
  1,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'vocab_50_words',
  'Vocabulary Builder',
  'בונה אוצר מילים',
  'Learn 50 words',
  'למד 50 מילים',
  '📚',
  'vocabulary',
  25,
  'words_learned',
  50,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'vocab_100_words',
  'Vocabulary Master',
  'מאסטר אוצר מילים',
  'Learn 100 words',
  'למד 100 מילים',
  '🎓',
  'vocabulary',
  50,
  'words_learned',
  100,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'vocab_review_complete',
  'Error Corrector',
  'מתקן שגיאות',
  'Complete a review quiz',
  'השלם חידון חזרה',
  '🔄',
  'vocabulary',
  15,
  'review_sessions',
  1,
  CURRENT_TIMESTAMP
)
ON CONFLICT (key) DO NOTHING;

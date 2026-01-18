-- Unseen Paragraph (Reading Comprehension) System Migration
-- Creates tables for reading comprehension feature with 2-3 paragraph texts and 5 multiple-choice questions

-- Table 1: Store unseen paragraphs
CREATE TABLE IF NOT EXISTS unseen_paragraphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en VARCHAR(255) NOT NULL,
  title_he VARCHAR(255),
  content TEXT NOT NULL,                      -- The 2-3 paragraphs in English
  complexity_level INTEGER NOT NULL CHECK (complexity_level >= 1 AND complexity_level <= 5),
  topic VARCHAR(100),                         -- Topic tag (e.g., "Science", "Nature", "Sports")
  hard_words JSONB,                           -- Array of {word: string, translation: string (Hebrew)}
  is_custom BOOLEAN DEFAULT FALSE,            -- TRUE if manually created by admin
  uses_failed_words BOOLEAN DEFAULT FALSE,    -- TRUE if paragraph uses words from user's failed vocab
  created_by UUID REFERENCES users(id),       -- User who created (for custom paragraphs)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_unseen_paragraphs_complexity ON unseen_paragraphs(complexity_level);
CREATE INDEX idx_unseen_paragraphs_topic ON unseen_paragraphs(topic);
CREATE INDEX idx_unseen_paragraphs_custom ON unseen_paragraphs(is_custom);

-- Table 2: Store questions for each paragraph
CREATE TABLE IF NOT EXISTS unseen_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paragraph_id UUID NOT NULL REFERENCES unseen_paragraphs(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,            -- 1-5
  question_text_en TEXT NOT NULL,              -- Question in English
  question_text_he TEXT,                       -- Question in Hebrew (optional)
  options JSONB NOT NULL,                      -- Array of 4 options ["option1", "option2", "option3", "option4"]
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3), -- Index of correct answer (0-3)
  explanation_he TEXT,                         -- Hebrew explanation of correct answer
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(paragraph_id, question_number)
);

CREATE INDEX idx_unseen_questions_paragraph ON unseen_questions(paragraph_id);

-- Table 3: Track user progress per paragraph
CREATE TABLE IF NOT EXISTS unseen_user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paragraph_id UUID NOT NULL REFERENCES unseen_paragraphs(id) ON DELETE CASCADE,
  best_score INTEGER DEFAULT 0 CHECK (best_score >= 0 AND best_score <= 100),  -- Percentage
  attempts INTEGER DEFAULT 0,
  last_attempted_at TIMESTAMP,
  first_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, paragraph_id)
);

CREATE INDEX idx_unseen_progress_user ON unseen_user_progress(user_id);
CREATE INDEX idx_unseen_progress_paragraph ON unseen_user_progress(paragraph_id);
CREATE INDEX idx_unseen_progress_score ON unseen_user_progress(user_id, best_score);

-- Table 4: Track reading sessions (individual attempts)
CREATE TABLE IF NOT EXISTS unseen_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paragraph_id UUID NOT NULL REFERENCES unseen_paragraphs(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 100),   -- Percentage
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 5,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned'))
);

CREATE INDEX idx_unseen_sessions_user ON unseen_sessions(user_id);
CREATE INDEX idx_unseen_sessions_paragraph ON unseen_sessions(paragraph_id);
CREATE INDEX idx_unseen_sessions_status ON unseen_sessions(status);
CREATE INDEX idx_unseen_sessions_completed ON unseen_sessions(completed_at);

-- Table 5: Store individual answers in a session (for detailed review)
CREATE TABLE IF NOT EXISTS unseen_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES unseen_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES unseen_questions(id) ON DELETE CASCADE,
  user_answer INTEGER NOT NULL CHECK (user_answer >= 0 AND user_answer <= 3),  -- Index 0-3
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_unseen_answers_session ON unseen_answers(session_id);
CREATE INDEX idx_unseen_answers_question ON unseen_answers(question_id);
CREATE INDEX idx_unseen_answers_correct ON unseen_answers(is_correct);

COMMENT ON TABLE unseen_paragraphs IS 'Stores reading comprehension paragraphs with 2-3 paragraphs of English text';
COMMENT ON TABLE unseen_questions IS 'Stores 5 multiple-choice questions per paragraph';
COMMENT ON TABLE unseen_user_progress IS 'Tracks best score and attempts per user per paragraph';
COMMENT ON TABLE unseen_sessions IS 'Tracks individual reading comprehension attempts';
COMMENT ON TABLE unseen_answers IS 'Stores answers for each question in a session for detailed review';

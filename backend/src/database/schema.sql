-- English Tutorial App Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  age INTEGER,
  current_level VARCHAR(50) DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  total_time_spent INTEGER DEFAULT 0, -- in minutes
  current_streak INTEGER DEFAULT 0,
  CONSTRAINT valid_level CHECK (current_level IN ('beginner', 'elementary', 'intermediate'))
);

CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- 2. LESSONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_number INTEGER NOT NULL,
  subtopic_number VARCHAR(10) NOT NULL, -- e.g., "1.3"
  title_en VARCHAR(255) NOT NULL,
  title_he VARCHAR(255) NOT NULL,
  level VARCHAR(50) NOT NULL,
  order_index INTEGER NOT NULL,
  theory_content_he TEXT NOT NULL, -- HTML content in Hebrew
  theory_content_en TEXT, -- Optional English content
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(topic_number, subtopic_number),
  CONSTRAINT valid_lesson_level CHECK (level IN ('beginner', 'elementary', 'intermediate'))
);

CREATE INDEX idx_lessons_level ON lessons(level);
CREATE INDEX idx_lessons_order ON lessons(order_index);

-- =====================================================
-- 3. EXERCISES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  question_text_he TEXT NOT NULL,
  question_text_en TEXT,
  options JSONB, -- for multiple choice: ["option1", "option2", "option3", "option4"]
  correct_answer TEXT NOT NULL,
  explanation_he TEXT NOT NULL,
  explanation_en TEXT,
  difficulty VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_exercise_type CHECK (type IN ('multiple_choice', 'fill_in_blank')),
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);
CREATE INDEX idx_exercises_type ON exercises(type);

-- =====================================================
-- 4. USER_PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'not_started',
  best_score INTEGER DEFAULT 0, -- percentage 0-100
  attempts INTEGER DEFAULT 0,
  first_completed_at TIMESTAMP,
  last_attempted_at TIMESTAMP,
  time_spent INTEGER DEFAULT 0, -- in seconds
  UNIQUE(user_id, lesson_id),
  CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed')),
  CONSTRAINT valid_score CHECK (best_score >= 0 AND best_score <= 100)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_progress_status ON user_progress(user_id, status);

-- =====================================================
-- 5. EXERCISE_RESULTS TABLE (Detailed History)
-- =====================================================
CREATE TABLE IF NOT EXISTS exercise_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  wrong_answers INTEGER NOT NULL,
  score INTEGER NOT NULL, -- percentage
  time_spent INTEGER NOT NULL, -- in seconds
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_result_score CHECK (score >= 0 AND score <= 100)
);

CREATE INDEX idx_results_user ON exercise_results(user_id);
CREATE INDEX idx_results_lesson ON exercise_results(lesson_id);
CREATE INDEX idx_results_date ON exercise_results(completed_at);
CREATE INDEX idx_results_user_lesson ON exercise_results(user_id, lesson_id);

-- =====================================================
-- 6. WRONG_ANSWERS TABLE (Mistake Tracking) ⭐
-- =====================================================
CREATE TABLE IF NOT EXISTS wrong_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  is_reviewed BOOLEAN DEFAULT FALSE,
  is_corrected BOOLEAN DEFAULT FALSE, -- TRUE if answered correctly in retry
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  corrected_at TIMESTAMP
);

CREATE INDEX idx_wrong_answers_user ON wrong_answers(user_id);
CREATE INDEX idx_wrong_answers_lesson ON wrong_answers(lesson_id);
CREATE INDEX idx_wrong_answers_exercise ON wrong_answers(exercise_id);
CREATE INDEX idx_wrong_answers_reviewed ON wrong_answers(user_id, is_reviewed);
CREATE INDEX idx_wrong_answers_corrected ON wrong_answers(user_id, is_corrected);

-- =====================================================
-- 7. ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(100) NOT NULL,
  name_he VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_he TEXT,
  icon VARCHAR(50), -- emoji or icon name
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INTEGER NOT NULL,
  CONSTRAINT valid_requirement CHECK (requirement_type IN ('lessons_completed', 'perfect_score', 'streak', 'mistakes_corrected'))
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);

-- =====================================================
-- SEED DATA: Initial Achievements
-- =====================================================
INSERT INTO achievements (name_en, name_he, description_en, description_he, icon, requirement_type, requirement_value) VALUES
('First Lesson Complete', 'השיעור הראשון הושלם', 'Complete your first lesson', 'השלם את השיעור הראשון שלך', '🏆', 'lessons_completed', 1),
('5 Lessons Streak', 'רצף של 5 שיעורים', 'Complete 5 lessons', 'השלם 5 שיעורים', '🎯', 'lessons_completed', 5),
('10 Lessons Master', 'שליטה ב-10 שיעורים', 'Complete 10 lessons', 'השלם 10 שיעורים', '🌟', 'lessons_completed', 10),
('Perfect Score', 'ציון מושלם', 'Get 100% on any lesson', 'קבל 100% בכל שיעור', '💯', 'perfect_score', 1),
('5-Day Streak', 'רצף של 5 ימים', 'Learn for 5 consecutive days', 'למד 5 ימים רצופים', '🔥', 'streak', 5),
('7-Day Streak', 'רצף של 7 ימים', 'Learn for 7 consecutive days', 'למד 7 ימים רצופים', '⭐', 'streak', 7),
('Mistake Corrector', 'מתקן טעויות', 'Correct 10 mistakes in retry mode', 'תקן 10 טעויות במצב חזרה', '✅', 'mistakes_corrected', 10)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VIEWS (Optional - for easier queries)
-- =====================================================

-- View to get user progress with lesson details
CREATE OR REPLACE VIEW v_user_lesson_progress AS
SELECT
  up.user_id,
  up.lesson_id,
  l.topic_number,
  l.subtopic_number,
  l.title_en,
  l.title_he,
  l.level,
  l.order_index,
  up.status,
  up.best_score,
  up.attempts,
  up.time_spent,
  up.first_completed_at,
  up.last_attempted_at
FROM user_progress up
JOIN lessons l ON up.lesson_id = l.id;

-- View to get user mistakes with exercise details
CREATE OR REPLACE VIEW v_user_mistakes AS
SELECT
  wa.id,
  wa.user_id,
  wa.lesson_id,
  l.title_en as lesson_title_en,
  l.title_he as lesson_title_he,
  wa.exercise_id,
  e.question_text_he,
  e.question_text_en,
  e.type as exercise_type,
  wa.user_answer,
  wa.correct_answer,
  e.explanation_he,
  wa.attempt_number,
  wa.is_reviewed,
  wa.is_corrected,
  wa.created_at,
  wa.corrected_at
FROM wrong_answers wa
JOIN lessons l ON wa.lesson_id = l.id
JOIN exercises e ON wa.exercise_id = e.id;

-- =====================================================
-- FUNCTIONS (Optional - for common operations)
-- =====================================================

-- Function to update lesson progress
CREATE OR REPLACE FUNCTION update_lesson_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lessons
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.lesson_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update lesson timestamp
CREATE TRIGGER trigger_update_lesson_progress
AFTER INSERT OR UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_lesson_progress();

-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================

COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE lessons IS 'Stores lesson content and theory';
COMMENT ON TABLE exercises IS 'Stores exercise questions for each lesson';
COMMENT ON TABLE user_progress IS 'Tracks user progress per lesson';
COMMENT ON TABLE exercise_results IS 'Detailed history of all exercise attempts';
COMMENT ON TABLE wrong_answers IS 'Tracks wrong answers for retry functionality';
COMMENT ON TABLE achievements IS 'Available achievements in the system';
COMMENT ON TABLE user_achievements IS 'Tracks which achievements users have earned';

-- =====================================================
-- COMPLETE
-- =====================================================
-- All 7 tables created successfully!
-- Run this file with: psql -U postgres -d english_tutorial_dev -f schema.sql

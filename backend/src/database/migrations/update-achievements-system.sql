-- Migration: Update Achievements System and Add Daily Challenges
-- Created: 2026-01-11
-- Description: Updates existing achievements table and adds daily challenges

-- ============================================
-- UPDATE ACHIEVEMENTS TABLE
-- ============================================

-- Add missing columns to achievements table
ALTER TABLE achievements
  ADD COLUMN IF NOT EXISTS key VARCHAR(100) UNIQUE,
  ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'progress',
  ADD COLUMN IF NOT EXISTS points_reward INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'bronze',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing achievements to have keys
UPDATE achievements SET key = 'legacy_' || id::text WHERE key IS NULL;

-- Add NOT NULL constraint after populating
ALTER TABLE achievements ALTER COLUMN key SET NOT NULL;

-- Update user_achievements table
ALTER TABLE user_achievements
  ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;

-- ============================================
-- DAILY CHALLENGES SYSTEM
-- ============================================

-- Daily challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,
  challenge_type VARCHAR(50) NOT NULL,
  challenge_target INTEGER NOT NULL,
  title_en VARCHAR(200) NOT NULL,
  title_he VARCHAR(200) NOT NULL,
  description_en TEXT NOT NULL,
  description_he TEXT NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 10,
  icon VARCHAR(50) NOT NULL DEFAULT '🎯',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User daily challenge progress
CREATE TABLE IF NOT EXISTS user_daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, challenge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_user_daily_challenges_user_id ON user_daily_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_challenges_completed ON user_daily_challenges(completed);

-- ============================================
-- CLEAR AND INSERT NEW ACHIEVEMENTS
-- ============================================

-- Delete old achievements
DELETE FROM user_achievements;
DELETE FROM achievements;

-- Insert comprehensive achievement set
INSERT INTO achievements (key, name_en, name_he, description_en, description_he, icon, category, points_reward, tier, requirement_type, requirement_value) VALUES
-- Progress Achievements
('first_lesson', 'First Steps', 'הצעדים הראשונים', 'Complete your first lesson', 'השלם את השיעור הראשון שלך', '🎯', 'progress', 5, 'bronze', 'lessons_completed', 1),
('ten_lessons', 'Getting Started', 'התחלה טובה', 'Complete 10 lessons', 'השלם 10 שיעורים', '📚', 'progress', 15, 'bronze', 'lessons_completed', 10),
('twenty_lessons', 'Dedicated Learner', 'לומד מסור', 'Complete 20 lessons', 'השלם 20 שיעורים', '🌟', 'progress', 25, 'silver', 'lessons_completed', 20),
('all_lessons', 'Master Student', 'תלמיד מצטיין', 'Complete all lessons', 'השלם את כל השיעורים', '🎓', 'progress', 50, 'gold', 'lessons_completed', 100),

-- Mastery Achievements (Perfect Scores)
('first_perfect', 'Perfectionist', 'פרפקציוניסט', 'Get your first perfect score (100%)', 'השג ציון מושלם ראשון (100%)', '💯', 'mastery', 10, 'bronze', 'perfect_score', 1),
('ten_perfects', 'Ace Student', 'תלמיד מעולה', 'Get 10 perfect scores', 'השג 10 ציונים מושלמים', '⭐', 'mastery', 20, 'silver', 'perfect_score', 10),
('twenty_perfects', 'Flawless', 'ללא רבב', 'Get 20 perfect scores', 'השג 20 ציונים מושלמים', '🌟', 'mastery', 35, 'gold', 'perfect_score', 20),

-- Streak Achievements
('streak_3', 'On Fire', 'בוער מרצון', 'Practice 3 days in a row', 'תרגל 3 ימים ברציפות', '🔥', 'streak', 10, 'bronze', 'streak', 3),
('streak_7', 'Week Warrior', 'לוחם השבוע', 'Practice 7 days in a row', 'תרגל 7 ימים ברציפות', '⚡', 'streak', 20, 'silver', 'streak', 7),
('streak_14', 'Unstoppable', 'בלתי ניתן לעצירה', 'Practice 14 days in a row', 'תרגל 14 ימים ברציפות', '💪', 'streak', 40, 'gold', 'streak', 14),
('streak_30', 'Legend', 'אגדה', 'Practice 30 days in a row', 'תרגל 30 ימים ברציפות', '👑', 'streak', 100, 'platinum', 'streak', 30),

-- Points Achievements
('points_100', 'Point Collector', 'אוסף נקודות', 'Earn 100 total points', 'צבור 100 נקודות סך הכל', '🪙', 'points', 10, 'bronze', 'lessons_completed', 100),
('points_500', 'Point Master', 'מאסטר נקודות', 'Earn 500 total points', 'צבור 500 נקודות סך הכל', '💰', 'points', 30, 'silver', 'lessons_completed', 500),
('points_1000', 'Point Legend', 'אגדת הנקודות', 'Earn 1000 total points', 'צבור 1000 נקודות סך הכל', '💎', 'points', 50, 'gold', 'lessons_completed', 1000),

-- Mistake Correction Achievements
('mistakes_10', 'Error Corrector', 'מתקן טעויות', 'Correct 10 mistakes', 'תקן 10 טעויות', '🔧', 'mastery', 10, 'bronze', 'mistakes_corrected', 10),
('mistakes_50', 'Perfectionist', 'מושלם', 'Correct 50 mistakes', 'תקן 50 טעויות', '✨', 'mastery', 25, 'silver', 'mistakes_corrected', 50);

-- Verify achievements were inserted
SELECT COUNT(*) as achievement_count FROM achievements;

-- Migration: Add Achievements and Daily Challenges System
-- Created: 2026-01-11
-- Description: Adds achievements/badges and daily challenges for enhanced gamification

-- ============================================
-- ACHIEVEMENTS SYSTEM
-- ============================================

-- Achievements table (predefined achievements)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,              -- Unique identifier (e.g., 'first_perfect_score')
  name_en VARCHAR(200) NOT NULL,                  -- Achievement name in English
  name_he VARCHAR(200) NOT NULL,                  -- Achievement name in Hebrew
  description_en TEXT NOT NULL,                   -- Description in English
  description_he TEXT NOT NULL,                   -- Description in Hebrew
  icon VARCHAR(50) NOT NULL DEFAULT '🏆',        -- Emoji or icon identifier
  category VARCHAR(50) NOT NULL,                  -- Category: 'mastery', 'progress', 'streak', 'special'
  points_reward INTEGER NOT NULL DEFAULT 0,       -- Bonus points for unlocking
  tier VARCHAR(20) NOT NULL DEFAULT 'bronze',     -- Tier: 'bronze', 'silver', 'gold', 'platinum'
  requirement_type VARCHAR(50) NOT NULL,          -- Type: 'lessons_completed', 'perfect_scores', 'streak_days', etc.
  requirement_value INTEGER NOT NULL,             -- Required value to unlock
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements (unlocked achievements per user)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress INTEGER DEFAULT 0,                     -- Current progress towards achievement
  UNIQUE(user_id, achievement_id)
);

-- Indexes for user achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);

-- ============================================
-- DAILY CHALLENGES SYSTEM
-- ============================================

-- Daily challenges table (generated challenges)
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,            -- Date of the challenge
  challenge_type VARCHAR(50) NOT NULL,            -- Type: 'complete_lessons', 'perfect_score', 'practice_time', etc.
  challenge_target INTEGER NOT NULL,              -- Target value to complete
  title_en VARCHAR(200) NOT NULL,                 -- Challenge title in English
  title_he VARCHAR(200) NOT NULL,                 -- Challenge title in Hebrew
  description_en TEXT NOT NULL,                   -- Description in English
  description_he TEXT NOT NULL,                   -- Description in Hebrew
  points_reward INTEGER NOT NULL DEFAULT 10,      -- Bonus points for completion
  icon VARCHAR(50) NOT NULL DEFAULT '🎯',        -- Emoji or icon identifier
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User daily challenge progress
CREATE TABLE IF NOT EXISTS user_daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,                     -- Current progress
  completed BOOLEAN DEFAULT FALSE,                -- Whether completed
  completed_at TIMESTAMP NULL,                    -- When completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, challenge_id)
);

-- Indexes for daily challenges
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_user_daily_challenges_user_id ON user_daily_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_challenges_completed ON user_daily_challenges(completed);

-- ============================================
-- INSERT PREDEFINED ACHIEVEMENTS
-- ============================================

-- Mastery Achievements
INSERT INTO achievements (key, name_en, name_he, description_en, description_he, icon, category, points_reward, tier, requirement_type, requirement_value) VALUES
('first_lesson', 'First Steps', 'הצעדים הראשונים', 'Complete your first lesson', 'השלם את השיעור הראשון שלך', '🎯', 'progress', 5, 'bronze', 'lessons_completed', 1),
('ten_lessons', 'Getting Started', 'התחלה טובה', 'Complete 10 lessons', 'השלם 10 שיעורים', '📚', 'progress', 15, 'bronze', 'lessons_completed', 10),
('twenty_lessons', 'Dedicated Learner', 'לומד מסור', 'Complete 20 lessons', 'השלם 20 שיעורים', '🌟', 'progress', 25, 'silver', 'lessons_completed', 20),
('all_lessons', 'Master Student', 'תלמיד מצטיין', 'Complete all lessons', 'השלם את כל השיעורים', '🎓', 'progress', 50, 'gold', 'lessons_completed', 100),

-- Perfect Score Achievements
('first_perfect', 'Perfectionist', 'פרפקציוניסט', 'Get your first perfect score (100%)', 'השג ציון מושלם ראשון (100%)', '💯', 'mastery', 10, 'bronze', 'perfect_scores', 1),
('ten_perfects', 'Ace Student', 'תלמיד מעולה', 'Get 10 perfect scores', 'השג 10 ציונים מושלמים', '⭐', 'mastery', 20, 'silver', 'perfect_scores', 10),
('twenty_perfects', 'Flawless', 'ללא רבב', 'Get 20 perfect scores', 'השג 20 ציונים מושלמים', '🌟', 'mastery', 35, 'gold', 'perfect_scores', 20),

-- Streak Achievements
('streak_3', 'On Fire', 'בוער מרצון', 'Practice 3 days in a row', 'תרגל 3 ימים ברציפות', '🔥', 'streak', 10, 'bronze', 'streak_days', 3),
('streak_7', 'Week Warrior', 'לוחם השבוע', 'Practice 7 days in a row', 'תרגל 7 ימים ברציפות', '⚡', 'streak', 20, 'silver', 'streak_days', 7),
('streak_14', 'Unstoppable', 'בלתי ניתן לעצירה', 'Practice 14 days in a row', 'תרגל 14 ימים ברציפות', '💪', 'streak', 40, 'gold', 'streak_days', 14),
('streak_30', 'Legend', 'אגדה', 'Practice 30 days in a row', 'תרגל 30 ימים ברציפות', '👑', 'streak', 100, 'platinum', 'streak_days', 30),

-- Points Achievements
('points_100', 'Point Collector', 'אוסף נקודות', 'Earn 100 total points', 'צבור 100 נקודות סך הכל', '🪙', 'progress', 10, 'bronze', 'total_points', 100),
('points_500', 'Point Master', 'מאסטר נקודות', 'Earn 500 total points', 'צבור 500 נקודות סך הכל', '💰', 'progress', 30, 'silver', 'total_points', 500),
('points_1000', 'Point Legend', 'אגדת הנקודות', 'Earn 1000 total points', 'צבור 1000 נקודות סך הכל', '💎', 'progress', 50, 'gold', 'total_points', 1000),

-- Speed Achievements
('speed_demon', 'Speed Demon', 'שד המהירות', 'Complete a lesson in under 1 minute', 'השלם שיעור בפחות מדקה', '⚡', 'special', 15, 'silver', 'fast_completion', 60),

-- Level Achievements
('level_3', 'Rising Star', 'כוכב עולה', 'Reach Level 3', 'הגע לרמה 3', '🌠', 'progress', 10, 'bronze', 'level_reached', 3),
('level_6', 'Champion', 'אלוף', 'Reach Level 6 (Royal Arena)', 'הגע לרמה 6 (זירה מלכותית)', '👑', 'progress', 50, 'platinum', 'level_reached', 6)

ON CONFLICT (key) DO NOTHING;

-- Verify achievements were inserted
SELECT COUNT(*) as achievement_count FROM achievements;

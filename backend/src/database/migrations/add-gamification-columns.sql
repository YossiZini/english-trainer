-- Migration: Add Gamification Columns to Users Table
-- Created: 2026-01-11
-- Description: Adds total_points and gamification_level columns for the gamification feature

-- Add gamification columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS gamification_level INTEGER DEFAULT 1 NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points);
CREATE INDEX IF NOT EXISTS idx_users_gamification_level ON users(gamification_level);

-- Update existing users to have default values (in case columns already existed with NULL)
UPDATE users
SET total_points = 0, gamification_level = 1
WHERE total_points IS NULL OR gamification_level IS NULL;

-- Add check constraint to ensure points are never negative
ALTER TABLE users
  ADD CONSTRAINT check_total_points_non_negative CHECK (total_points >= 0);

-- Add check constraint to ensure level is at least 1
ALTER TABLE users
  ADD CONSTRAINT check_gamification_level_min CHECK (gamification_level >= 1);

-- Verify the changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name IN ('total_points', 'gamification_level');

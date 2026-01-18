-- Migration: Add Streak Tracking Columns to Users Table
-- Created: 2026-01-13
-- Description: Adds columns for tracking login streaks and daily points

-- Add streak tracking columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS last_activity_date DATE,
  ADD COLUMN IF NOT EXISTS points_today INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS points_today_date DATE;

-- Add index for performance on activity date queries
CREATE INDEX IF NOT EXISTS idx_users_last_activity_date ON users(last_activity_date);

-- Add check constraint to ensure points_today is never negative
ALTER TABLE users
  ADD CONSTRAINT check_points_today_non_negative CHECK (points_today >= 0);

-- Initialize existing users with today's date (so they don't get false streaks)
UPDATE users
SET last_activity_date = CURRENT_DATE,
    points_today_date = CURRENT_DATE
WHERE last_activity_date IS NULL;

-- Verify the changes
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('last_activity_date', 'points_today', 'points_today_date');

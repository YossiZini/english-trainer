-- Migration: Add Student Name Column to Users Table
-- Created: 2026-01-13
-- Description: Adds student_name column to display the student's actual name

-- Add student_name column to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS student_name VARCHAR(255);

-- For existing users, set student_name to name (username) as a default
UPDATE users
SET student_name = name
WHERE student_name IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name = 'student_name';

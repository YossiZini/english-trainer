-- Migration: Enhanced Vocabulary Word Scoring System
-- Description: Add per-word score tracking with chronological history and mastery levels

-- Table: vocabulary_word_scores
-- Tracks individual word performance per user with attempt history
CREATE TABLE IF NOT EXISTS vocabulary_word_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    success_count INTEGER DEFAULT 0 CHECK (success_count >= 0),
    fail_count INTEGER DEFAULT 0 CHECK (fail_count >= 0),
    attempt_history JSONB DEFAULT '[]'::jsonb,  -- Array of ["success", "failed", "success"]
    mastery_level VARCHAR(20) DEFAULT 'not_started' CHECK (mastery_level IN ('not_started', 'learning', 'struggling', 'mastered')),
    last_attempt_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word_id)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_word_scores_user_id ON vocabulary_word_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_word_scores_word_id ON vocabulary_word_scores(word_id);
CREATE INDEX IF NOT EXISTS idx_word_scores_mastery ON vocabulary_word_scores(user_id, mastery_level);
CREATE INDEX IF NOT EXISTS idx_word_scores_last_attempt ON vocabulary_word_scores(user_id, last_attempt_at DESC);
CREATE INDEX IF NOT EXISTS idx_word_scores_struggling ON vocabulary_word_scores(user_id) WHERE mastery_level = 'struggling';

-- Table: vocabulary_kanban_tasks
-- Track implementation progress in Kanban/Scrum style
CREATE TABLE IF NOT EXISTS vocabulary_kanban_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'done')),
    priority INTEGER DEFAULT 0,
    category VARCHAR(50),  -- database, backend, frontend, testing
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    assignee VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kanban_status ON vocabulary_kanban_tasks(status);
CREATE INDEX IF NOT EXISTS idx_kanban_category ON vocabulary_kanban_tasks(category);

-- Update vocabulary_user_stats table to track unique words statistics
ALTER TABLE vocabulary_user_stats
ADD COLUMN IF NOT EXISTS total_unique_words_with_success INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_unique_words_with_failure INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_quiz_at TIMESTAMP;

-- Pre-populate Kanban tasks
INSERT INTO vocabulary_kanban_tasks (title, description, status, category, priority) VALUES
('Create vocabulary_word_scores table migration', 'Database schema for per-word score tracking', 'done', 'database', 1),
('Create vocabulary_kanban_tasks table migration', 'Database schema for Kanban progress tracking', 'done', 'database', 1),
('Implement VocabularyWordScores model', 'Backend model for word score operations', 'backlog', 'backend', 2),
('Implement VocabularyKanbanTask model', 'Backend model for Kanban task operations', 'backlog', 'backend', 2),
('Update vocabulary.service.js - word score recording', 'Add word score tracking to submitAnswer', 'backlog', 'backend', 3),
('Implement smart quiz building logic', 'Build quiz with 30% failed, 70% new words', 'backlog', 'backend', 3),
('Implement failed words quiz logic', 'Create dedicated failed words quiz mode', 'backlog', 'backend', 3),
('Add new vocabulary API routes', 'Routes for failed words quiz, word stats', 'backlog', 'backend', 4),
('Create kanban API routes', 'Admin-only routes for Kanban management', 'backlog', 'backend', 4),
('Update vocabularyService.js frontend', 'Add new API client methods', 'backlog', 'frontend', 5),
('Create kanbanService.js frontend', 'API client for Kanban endpoints', 'backlog', 'frontend', 5),
('Modify VocabularyHomePage for failed words', 'Add failed words button and mastery stats', 'backlog', 'frontend', 6),
('Create VocabularyWordStats component', 'Word-level statistics page', 'backlog', 'frontend', 6),
('Create KanbanProgressPage component', 'Kanban board UI (admin-only)', 'backlog', 'frontend', 6),
('Data migration script', 'Migrate existing history to word scores', 'backlog', 'database', 7),
('Unit tests for new models', 'Test VocabularyWordScores and KanbanTask models', 'backlog', 'testing', 8),
('Integration tests for new APIs', 'Test new API endpoints', 'backlog', 'testing', 8)
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE vocabulary_word_scores IS 'Per-user per-word performance tracking with chronological attempt history';
COMMENT ON COLUMN vocabulary_word_scores.attempt_history IS 'JSONB array of attempt results: ["success", "failed", "success"]';
COMMENT ON COLUMN vocabulary_word_scores.mastery_level IS 'Current mastery: not_started, learning, struggling (last 2+ failures), mastered';
COMMENT ON TABLE vocabulary_kanban_tasks IS 'Kanban board for tracking feature implementation progress';

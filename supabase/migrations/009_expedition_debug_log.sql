-- Migration 009: Add debug_log column to expeditions table
-- Stores detailed calculation logs for admin inspection

ALTER TABLE expeditions ADD COLUMN IF NOT EXISTS debug_log JSONB;

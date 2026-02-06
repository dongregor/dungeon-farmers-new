-- Migration 003: Add missing INSERT policy for players table and account_level column
-- This allows new users to create their own player record during onboarding

-- Add account_level column to players table (was missing from initial schema)
ALTER TABLE players ADD COLUMN IF NOT EXISTS account_level INTEGER NOT NULL DEFAULT 1;

-- Add INSERT policy for players table (was missing from initial schema)
-- Users can only insert a player record for themselves
CREATE POLICY "Users can insert their own player data"
  ON players FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Note: guild_masters table was already created in 001_initial_schema.sql
-- with player_id referencing players(id). The RLS policies there use the
-- subquery pattern: player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid())

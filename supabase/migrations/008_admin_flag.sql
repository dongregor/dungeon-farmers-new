-- Migration 008: Add admin flag to players table
-- Used for admin panel access control

ALTER TABLE players ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- RLS policy: allow admins to read all data
-- Admin policies for read access across all tables
CREATE POLICY "Admins can view all players"
  ON players FOR SELECT
  USING (
    auth.uid() IN (SELECT auth_user_id FROM players WHERE is_admin = TRUE)
  );

CREATE POLICY "Admins can view all heroes"
  ON heroes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM players WHERE auth_user_id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can view all expeditions"
  ON expeditions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM players WHERE auth_user_id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can view all guild masters"
  ON guild_masters FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM players WHERE auth_user_id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can view all equipment"
  ON equipment FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM players WHERE auth_user_id = auth.uid() AND is_admin = TRUE)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Add view_count and copy_count columns to prompts and skills tables.
-- Also creates an increment_count() helper for atomic updates.
-- Run this in your Supabase project's SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE prompts ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS copy_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE skills ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS copy_count INTEGER NOT NULL DEFAULT 0;

-- Atomic increment helper (avoids read-then-write race condition).
-- Called from the /api/track server route using the service-role key.
CREATE OR REPLACE FUNCTION increment_count(
  p_table  TEXT,
  p_id     UUID,
  p_column TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Whitelist table and column names to prevent SQL injection
  IF p_table NOT IN ('prompts', 'skills') THEN
    RAISE EXCEPTION 'Invalid table: %', p_table;
  END IF;
  IF p_column NOT IN ('view_count', 'copy_count') THEN
    RAISE EXCEPTION 'Invalid column: %', p_column;
  END IF;

  EXECUTE format(
    'UPDATE %I SET %I = %I + 1 WHERE id = $1',
    p_table, p_column, p_column
  ) USING p_id;
END;
$$;

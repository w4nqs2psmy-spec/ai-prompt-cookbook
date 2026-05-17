-- ─────────────────────────────────────────────────────────────────────────────
-- Likes table + like_count columns on prompts and skills.
-- Run this in your Supabase project's SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS likes (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type        TEXT        NOT NULL CHECK (item_type IN ('prompt', 'skill')),
  item_id          UUID        NOT NULL,
  user_fingerprint TEXT        NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(item_type, item_id, user_fingerprint)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read likes"
  ON likes
  FOR SELECT
  USING (true);

ALTER TABLE prompts ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE skills  ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0;

-- ── Atomic like-count helpers ──────────────────────────────────────────────
-- Called from /api/like using the service-role key.
-- Whitelists table names to prevent SQL injection.

CREATE OR REPLACE FUNCTION increment_like_count(
  p_table TEXT,
  p_id    UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_table NOT IN ('prompts', 'skills') THEN
    RAISE EXCEPTION 'Invalid table: %', p_table;
  END IF;
  EXECUTE format(
    'UPDATE %I SET like_count = like_count + 1 WHERE id = $1',
    p_table
  ) USING p_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_like_count(
  p_table TEXT,
  p_id    UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_table NOT IN ('prompts', 'skills') THEN
    RAISE EXCEPTION 'Invalid table: %', p_table;
  END IF;
  EXECUTE format(
    'UPDATE %I SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1',
    p_table
  ) USING p_id;
END;
$$;

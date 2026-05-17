CREATE TABLE IF NOT EXISTS comments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type         TEXT        NOT NULL CHECK (item_type IN ('prompt', 'skill')),
  item_id           UUID        NOT NULL,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_display_name TEXT        NOT NULL,
  content           TEXT        NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Logged in users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

/* ── comment_count columns ─────────────────────────────────────── */

ALTER TABLE prompts ADD COLUMN IF NOT EXISTS comment_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE skills  ADD COLUMN IF NOT EXISTS comment_count INTEGER NOT NULL DEFAULT 0;

/* ── Helper functions ──────────────────────────────────────────── */

CREATE OR REPLACE FUNCTION increment_comment_count(p_table TEXT, p_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_table = 'prompts' THEN
    UPDATE prompts SET comment_count = comment_count + 1 WHERE id = p_id;
  ELSIF p_table = 'skills' THEN
    UPDATE skills SET comment_count = comment_count + 1 WHERE id = p_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_comment_count(p_table TEXT, p_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_table = 'prompts' THEN
    UPDATE prompts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = p_id;
  ELSIF p_table = 'skills' THEN
    UPDATE skills SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = p_id;
  END IF;
END;
$$;

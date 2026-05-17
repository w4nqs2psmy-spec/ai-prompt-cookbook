-- ─────────────────────────────────────────────────────────────────────────────
-- AI Prompt Cookbook — skills table
-- Run this in your Supabase project's SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS skills (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  description    TEXT        NOT NULL,
  subject        TEXT        NOT NULL DEFAULT 'general',
  level          TEXT        NOT NULL DEFAULT 'primary',
  tool           TEXT        NOT NULL DEFAULT 'any',
  use_case       TEXT        NOT NULL DEFAULT 'lesson_planning',
  tags           TEXT[]      NOT NULL DEFAULT '{}',
  steps          JSONB       NOT NULL DEFAULT '[]',
  tips           TEXT,
  is_pro         BOOLEAN     NOT NULL DEFAULT false,
  is_approved    BOOLEAN     NOT NULL DEFAULT false,
  submitted_by   TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Allow reading only approved skills (service role bypasses this for all admin ops)
CREATE POLICY "Public can read approved skills"
  ON skills
  FOR SELECT
  USING (is_approved = true);

-- No INSERT / UPDATE / DELETE policies for anon — all mutations go through
-- server actions using the service_role key which bypasses RLS.

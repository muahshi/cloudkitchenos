-- ════════════════════════════════════════════════════════════════════════════
-- Migration 002: Add revenue + breakeven fields to kitchens
-- Run after 001_initial_schema.sql
-- ════════════════════════════════════════════════════════════════════════════

-- Add columns (safe — idempotent with IF NOT EXISTS pattern)
ALTER TABLE public.kitchens
  ADD COLUMN IF NOT EXISTS estimated_monthly_revenue TEXT,
  ADD COLUMN IF NOT EXISTS estimated_breakeven TEXT,
  ADD COLUMN IF NOT EXISTS verdict TEXT,
  ADD COLUMN IF NOT EXISTS quick_wins JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS key_risks JSONB DEFAULT '[]';

-- Add analytics index on score range
CREATE INDEX IF NOT EXISTS kitchens_score_idx
  ON public.kitchens (feasibility_score DESC);

-- ── Full-text search index on location + cuisine ──────────────────────────────
-- Useful for dashboard search feature
CREATE INDEX IF NOT EXISTS kitchens_location_gin
  ON public.kitchens USING gin(to_tsvector('english', location || ' ' || cuisine));

-- ── Subscription index ────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS subscriptions_status_idx
  ON public.subscriptions (user_id, status)
  WHERE status = 'active';

-- ── Verify columns added ──────────────────────────────────────────────────────
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'kitchens' AND table_schema = 'public'
-- ORDER BY ordinal_position;

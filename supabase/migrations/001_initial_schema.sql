-- ════════════════════════════════════════════════════════════════════════════
-- CloudKitchenOS — Supabase Schema + RLS Policies
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)
-- ════════════════════════════════════════════════════════════════════════════

-- ── Enable UUID extension ─────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── ENUM types ────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE kitchen_type AS ENUM (
    'ghost_kitchen',
    'shared_kitchen',
    'home_kitchen',
    'cloud_kitchen_franchise'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ════════════════════════════════════════════════════════════════════════════
-- TABLE: profiles
-- Extends auth.users with app-specific data
-- ════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  city        TEXT,
  is_pro      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════════════
-- TABLE: kitchens
-- Stores feasibility analysis results
-- ════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.kitchens (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location            TEXT NOT NULL,
  budget              NUMERIC(12,2) NOT NULL CHECK (budget > 0),
  kitchen_type        kitchen_type NOT NULL,
  cuisine             TEXT NOT NULL,
  feasibility_score   SMALLINT NOT NULL CHECK (feasibility_score BETWEEN 0 AND 100),
  swot                JSONB NOT NULL DEFAULT '{}',
  roadmap             JSONB NOT NULL DEFAULT '[]',
  raw_response        TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated_at auto-trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS kitchens_updated_at ON public.kitchens;
CREATE TRIGGER kitchens_updated_at
  BEFORE UPDATE ON public.kitchens
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Performance indexes
CREATE INDEX IF NOT EXISTS kitchens_user_id_idx ON public.kitchens (user_id);
CREATE INDEX IF NOT EXISTS kitchens_created_at_idx ON public.kitchens (created_at DESC);

-- ════════════════════════════════════════════════════════════════════════════
-- TABLE: subscriptions
-- Tracks PRO purchases
-- ════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status        subscription_status NOT NULL DEFAULT 'active',
  plan          TEXT NOT NULL DEFAULT 'pro' CHECK (plan IN ('free', 'pro')),
  amount_paid   NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency      TEXT NOT NULL DEFAULT 'INR',
  payment_id    TEXT UNIQUE,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions (user_id);

-- ════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY — Enable on all tables
-- ════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchens      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ── profiles RLS ──────────────────────────────────────────────────────────────
-- Users can only read/write their own profile
CREATE POLICY "profiles: users read own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: users update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── kitchens RLS ─────────────────────────────────────────────────────────────
-- Full CRUD — but ONLY for the authenticated owner
CREATE POLICY "kitchens: users read own"
  ON public.kitchens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "kitchens: users insert own"
  ON public.kitchens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "kitchens: users update own"
  ON public.kitchens FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "kitchens: users delete own"
  ON public.kitchens FOR DELETE
  USING (auth.uid() = user_id);

-- ── subscriptions RLS ─────────────────────────────────────────────────────────
-- Users can only read their own subscriptions (write handled by service role only)
CREATE POLICY "subscriptions: users read own"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role (used in server actions) can insert subscriptions
-- This is enforced by using supabaseAdmin (service role key) in server actions
-- NOT exposed to client

-- ════════════════════════════════════════════════════════════════════════════
-- HELPER VIEWS (optional, for analytics)
-- ════════════════════════════════════════════════════════════════════════════
-- Note: Views inherit RLS from base tables by default in Supabase
CREATE OR REPLACE VIEW public.user_kitchen_summary AS
SELECT
  k.user_id,
  COUNT(*) as total_analyses,
  AVG(k.feasibility_score)::NUMERIC(5,1) as avg_score,
  MAX(k.feasibility_score) as best_score,
  MAX(k.created_at) as last_analysis_at
FROM public.kitchens k
GROUP BY k.user_id;

-- ════════════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- Run these to confirm setup:
-- SELECT * FROM pg_policies WHERE tablename IN ('kitchens', 'profiles', 'subscriptions');
-- SELECT table_name, row_security FROM information_schema.tables WHERE table_schema = 'public';
-- ════════════════════════════════════════════════════════════════════════════

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ── Environment Guards ──────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

// ── Browser / Client-Side Client (uses anon key + RLS enforced) ────────────
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ── Server-Side Admin Client (bypasses RLS – use ONLY in server actions) ───
export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ── Auth Helpers ────────────────────────────────────────────────────────────
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ── Kitchen Data Helpers (RLS enforced – user sees only their own rows) ─────
export async function getUserKitchens(userId: string) {
  const { data, error } = await supabase
    .from("kitchens")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveKitchenAnalysis(
  userId: string,
  analysis: {
    location: string;
    budget: number;
    kitchen_type: string;
    cuisine: string;
    feasibility_score: number;
    swot: Record<string, string[]>;
    roadmap: Record<string, unknown>[];
    raw_response: string;
  }
) {
  const { data, error } = await supabase
    .from("kitchens")
    .insert({
      user_id: userId,
      ...analysis,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getKitchenById(kitchenId: string, userId: string) {
  const { data, error } = await supabase
    .from("kitchens")
    .select("*")
    .eq("id", kitchenId)
    .eq("user_id", userId) // RLS double-check in query
    .single();
  if (error) throw error;
  return data;
}

// ── PRO Access Check ────────────────────────────────────────────────────────
export async function checkProAccess(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status, expires_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();
  if (error) return false;
  if (!data) return false;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return false;
  return true;
}

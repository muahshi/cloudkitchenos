"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import type { FeasibilityInput, FeasibilityResult } from "@/types/database";

// ── Server-side Supabase client using auth header from cookie ─────────────────
async function createSupabaseServer() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value ?? 
                      cookieStore.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`)?.value;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {},
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}

// ── Action: Save kitchen analysis ─────────────────────────────────────────────
export async function saveAnalysisAction(
  input: FeasibilityInput,
  result: FeasibilityResult
): Promise<{ success: boolean; kitchenId?: string; error?: string }> {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be signed in to save analyses." };
  }

  const { data, error } = await supabase
    .from("kitchens")
    .insert({
      user_id: user.id,
      location: input.location.trim(),
      budget: input.budget,
      kitchen_type: input.kitchenType,
      cuisine: input.cuisine.trim(),
      feasibility_score: Math.round(result.feasibilityScore),
      swot: result.swot as unknown as never,
      roadmap: result.roadmap as unknown as never,
      raw_response: JSON.stringify(result),
    })
    .select("id")
    .single();

  if (error) {
    console.error("saveAnalysisAction DB error:", error);
    return { success: false, error: "Failed to save analysis. Please try again." };
  }

  return { success: true, kitchenId: data.id };
}

// ── Action: Get user kitchen count ────────────────────────────────────────────
export async function getKitchenCountAction(): Promise<number> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("kitchens")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) return 0;
  return count ?? 0;
}

// ── Action: Delete kitchen analysis ──────────────────────────────────────────
export async function deleteKitchenAction(
  kitchenId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServer();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("kitchens")
    .delete()
    .eq("id", kitchenId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: "Failed to delete analysis." };
  return { success: true };
}

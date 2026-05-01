"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { FeasibilityInput, FeasibilityResult } from "@/types/database";

// ── Create Supabase server client (reads cookies for session) ─────────────────
function createSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// ── Action: Save kitchen analysis ─────────────────────────────────────────────
export async function saveAnalysisAction(
  input: FeasibilityInput,
  result: FeasibilityResult
): Promise<{ success: boolean; kitchenId?: string; error?: string }> {
  const supabase = createSupabaseServer();

  // Verify session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "You must be signed in to save analyses.",
    };
  }

  // Save to DB (RLS policy ensures user can only insert their own rows)
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
    return {
      success: false,
      error: "Failed to save analysis. Please try again.",
    };
  }

  return { success: true, kitchenId: data.id };
}

// ── Action: Get user's kitchen count (for free tier gating) ───────────────────
export async function getKitchenCountAction(): Promise<number> {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("kitchens")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) return 0;
  return count ?? 0;
}

// ── Action: Delete a kitchen analysis ─────────────────────────────────────────
export async function deleteKitchenAction(
  kitchenId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createSupabaseServer();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  // RLS ensures this only deletes if user_id matches
  const { error } = await supabase
    .from("kitchens")
    .delete()
    .eq("id", kitchenId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Failed to delete analysis." };
  }

  return { success: true };
}

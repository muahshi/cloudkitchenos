"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, getUserKitchens, signOut } from "@/lib/supabase";
import { ScoreRing } from "@/components/ScoreRing";
import {
  formatINR,
  formatDate,
  kitchenTypeLabel,
  kitchenTypeIcon,
  getScoreColor,
  getScoreBg,
} from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

// ── Types ─────────────────────────────────────────────────────────────────────
interface KitchenRow {
  id: string;
  location: string;
  budget: number;
  kitchen_type: string;
  cuisine: string;
  feasibility_score: number;
  created_at: string;
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-700 rounded" />
          <div className="h-3 w-24 bg-slate-700/60 rounded" />
        </div>
        <div className="w-14 h-14 bg-slate-700 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-700/40 rounded" />
        <div className="h-3 w-3/4 bg-slate-700/40 rounded" />
      </div>
    </div>
  );
}

// ── Kitchen card ──────────────────────────────────────────────────────────────
function KitchenCard({ kitchen }: { kitchen: KitchenRow }) {
  const scoreColor = getScoreColor(kitchen.feasibility_score);
  const scoreBg = getScoreBg(kitchen.feasibility_score);

  return (
    <div className="group bg-slate-800/40 border border-white/5 hover:border-indigo-500/20 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{kitchenTypeIcon(kitchen.kitchen_type)}</span>
            <h3 className="font-bold text-white text-sm truncate">{kitchen.location}</h3>
          </div>
          <div className="text-xs text-slate-400">{kitchen.cuisine}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            {kitchenTypeLabel(kitchen.kitchen_type)}
          </div>
        </div>
        <div
          className={`flex-shrink-0 ml-3 px-3 py-1.5 rounded-xl border text-center ${scoreBg}`}
        >
          <div className={`text-xl font-black ${scoreColor}`}>
            {kitchen.feasibility_score}
          </div>
          <div className="text-[9px] text-slate-400 font-medium">/100</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Budget: <span className="text-slate-300">{formatINR(kitchen.budget, true)}</span>
        </div>
        <div className="text-xs text-slate-600">{formatDate(kitchen.created_at)}</div>
      </div>

      <Link
        href={`/dashboard/kitchen/${kitchen.id}`}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-700 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 text-xs text-slate-400 group-hover:text-indigo-300 transition-all font-medium"
      >
        View Full Report →
      </Link>
    </div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar({
  kitchens,
  isPro,
}: {
  kitchens: KitchenRow[];
  isPro: boolean;
}) {
  const avgScore =
    kitchens.length > 0
      ? Math.round(
          kitchens.reduce((s, k) => s + k.feasibility_score, 0) /
            kitchens.length
        )
      : 0;
  const bestScore =
    kitchens.length > 0
      ? Math.max(...kitchens.map((k) => k.feasibility_score))
      : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {[
        { label: "Total Analyses", value: kitchens.length, suffix: "" },
        { label: "Avg Score", value: avgScore, suffix: "/100" },
        { label: "Best Score", value: bestScore, suffix: "/100" },
        { label: "Plan", value: isPro ? "PRO" : "Free", suffix: "", special: true },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-slate-800/40 border border-white/5 rounded-xl p-4 text-center"
        >
          <div
            className={`text-xl font-black ${stat.special ? (isPro ? "text-indigo-400" : "text-slate-400") : "text-white"}`}
          >
            {stat.value}
            <span className="text-sm text-slate-500">{stat.suffix}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [kitchens, setKitchens] = useState<KitchenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  const loadData = useCallback(async (uid: string) => {
    try {
      const data = await getUserKitchens(uid);
      setKitchens(data ?? []);

      // Check PRO status
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", uid)
        .eq("status", "active")
        .maybeSingle();
      setIsPro(!!sub);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }
      setUser(session.user);
      loadData(session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.replace("/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router, loadData]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/" className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-black text-[10px]">CK</span>
              </Link>
              <span className="text-xs text-slate-500 font-medium">CloudKitchenOS</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Your Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {user?.email}
              {isPro && (
                <span className="ml-2 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/#calculator"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              + New Analysis
            </Link>
            <button
              onClick={handleSignOut}
              className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2.5 rounded-xl transition-all"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar kitchens={kitchens} isPro={isPro} />

        {/* PRO upsell (free users) */}
        {!isPro && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Upgrade to PRO</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Get FSSAI guide, GST setup, vendor contacts, and financial model
              </div>
            </div>
            <Link
              href="/#pricing"
              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-500/20 whitespace-nowrap"
            >
              Unlock PRO — ₹1,499
            </Link>
          </div>
        )}

        {/* Kitchen grid */}
        {kitchens.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-lg font-bold text-white mb-2">No analyses yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Run your first kitchen feasibility check — it's free.
            </p>
            <Link
              href="/#calculator"
              className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 text-sm shadow-lg shadow-indigo-500/25"
            >
              🚀 Analyze Your First Kitchen
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">
                Your Analyses{" "}
                <span className="text-slate-500 font-normal">({kitchens.length})</span>
              </h2>
              <div className="text-xs text-slate-500">
                Sorted by latest
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {kitchens.map((k) => (
                <KitchenCard key={k.id} kitchen={k} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

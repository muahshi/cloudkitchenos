"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, getKitchenById } from "@/lib/supabase";
import { ScoreRing } from "@/components/ScoreRing";
import {
  formatINR,
  formatDate,
  kitchenTypeLabel,
  kitchenTypeIcon,
  getScoreColor,
} from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  tasks: string[];
  estimatedCost: string;
  milestone: string;
}

interface KitchenDetail {
  id: string;
  location: string;
  budget: number;
  kitchen_type: string;
  cuisine: string;
  feasibility_score: number;
  swot: SwotData;
  roadmap: RoadmapPhase[];
  raw_response: string;
  created_at: string;
}

// ── SWOT grid ─────────────────────────────────────────────────────────────────
function SwotGrid({ swot }: { swot: SwotData }) {
  const quadrants = [
    { key: "strengths", label: "Strengths", color: "text-emerald-400", bg: "bg-emerald-950/40 border-emerald-500/10", dot: "bg-emerald-500" },
    { key: "weaknesses", label: "Weaknesses", color: "text-red-400", bg: "bg-red-950/40 border-red-500/10", dot: "bg-red-500" },
    { key: "opportunities", label: "Opportunities", color: "text-blue-400", bg: "bg-blue-950/40 border-blue-500/10", dot: "bg-blue-500" },
    { key: "threats", label: "Threats", color: "text-amber-400", bg: "bg-amber-950/40 border-amber-500/10", dot: "bg-amber-500" },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {quadrants.map((q) => (
        <div key={q.key} className={`rounded-xl p-4 border ${q.bg}`}>
          <div className={`flex items-center gap-2 mb-3`}>
            <div className={`w-2 h-2 rounded-full ${q.dot}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${q.color}`}>
              {q.label}
            </span>
          </div>
          <ul className="space-y-2">
            {(swot[q.key] ?? []).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <span className={`mt-1 text-[7px] ${q.color} flex-shrink-0`}>◆</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ── Roadmap timeline ──────────────────────────────────────────────────────────
function RoadmapTimeline({ roadmap }: { roadmap: RoadmapPhase[] }) {
  const [openPhase, setOpenPhase] = useState<number>(1);

  return (
    <div className="space-y-0">
      {roadmap.map((phase, i) => {
        const isOpen = openPhase === phase.phase;
        const isLast = i === roadmap.length - 1;
        return (
          <div key={phase.phase} className="relative flex gap-4">
            {/* Connector line */}
            {!isLast && (
              <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 to-transparent z-0" />
            )}
            {/* Phase number */}
            <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-indigo-500/40 bg-slate-900 flex items-center justify-center mt-0.5">
              <span className="text-indigo-400 font-black text-sm">{phase.phase}</span>
            </div>
            {/* Content */}
            <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
              <button
                onClick={() => setOpenPhase(isOpen ? 0 : phase.phase)}
                className="w-full text-left flex items-start justify-between gap-3 group py-1"
              >
                <div>
                  <div className="font-bold text-white text-sm leading-tight">{phase.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{phase.duration}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-indigo-400 font-medium">{phase.estimatedCost}</span>
                  </div>
                </div>
                <span className={`text-slate-500 mt-1 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="mt-3 space-y-2">
                  <div className="space-y-1.5 mb-3">
                    {phase.tasks.map((task, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                        {task}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-indigo-500/8 border border-indigo-500/15 rounded-lg px-3 py-2">
                    <span className="text-indigo-400 text-xs">🎯</span>
                    <span className="text-xs text-indigo-300 font-medium">
                      Milestone: {phase.milestone}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Metric pill ───────────────────────────────────────────────────────────────
function MetricPill({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-slate-800/60 border border-white/5 rounded-xl px-4 py-3 text-center">
      <div className={`font-bold text-sm ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function KitchenDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [kitchen, setKitchen] = useState<KitchenDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "swot" | "roadmap">("overview");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      try {
        const data = await getKitchenById(id, session.user.id);
        setKitchen(data as unknown as KitchenDetail);
      } catch {
        setError("Report not found or you don't have access.");
      } finally {
        setLoading(false);
      }
    });
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading report...</span>
        </div>
      </div>
    );
  }

  if (error || !kitchen) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-white font-bold text-lg mb-2">{error ?? "Report not found"}</h2>
          <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const rawResponse = (() => {
    try { return JSON.parse(kitchen.raw_response); } catch { return null; }
  })();

  const verdict = rawResponse?.verdict ?? (
    kitchen.feasibility_score >= 75 ? "Highly Feasible" :
    kitchen.feasibility_score >= 60 ? "Feasible" :
    kitchen.feasibility_score >= 45 ? "Risky" : "Not Recommended"
  );

  const summary = rawResponse?.summary ?? "";
  const estimatedRevenue = rawResponse?.estimatedMonthlyRevenue ?? "—";
  const breakeven = rawResponse?.estimatedBreakeven ?? "—";
  const keyRisks: string[] = rawResponse?.keyRisks ?? [];
  const quickWins: string[] = rawResponse?.quickWins ?? [];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>›</span>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <span>›</span>
          <span className="text-slate-300">{kitchen.location} Report</span>
        </div>

        {/* Hero card */}
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Score */}
            <div className="flex-shrink-0">
              <ScoreRing
                score={kitchen.feasibility_score}
                verdict={verdict}
                size="lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xl">{kitchenTypeIcon(kitchen.kitchen_type)}</span>
                <h1 className="text-xl font-black text-white">{kitchen.location}</h1>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {kitchenTypeLabel(kitchen.kitchen_type)}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <div className="text-xs text-slate-400">
                  Cuisine: <span className="text-white font-medium">{kitchen.cuisine}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Budget: <span className="text-white font-medium">{formatINR(kitchen.budget)}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Analyzed: <span className="text-slate-300">{formatDate(kitchen.created_at)}</span>
                </div>
              </div>

              {summary && (
                <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
              )}
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/5">
            <MetricPill label="Est. Monthly Revenue" value={estimatedRevenue} color="text-emerald-400" />
            <MetricPill label="Break-even Timeline" value={breakeven} color="text-amber-400" />
            <MetricPill
              label="Feasibility Score"
              value={`${kitchen.feasibility_score}/100`}
              color={getScoreColor(kitchen.feasibility_score)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl mb-6">
          {(["overview", "swot", "roadmap"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all capitalize ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "overview" ? "Overview" : tab === "swot" ? "SWOT Analysis" : "Roadmap"}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Quick wins */}
            {quickWins.length > 0 && (
              <div className="bg-emerald-950/30 border border-emerald-500/15 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-emerald-400 text-lg">⚡</span>
                  <h3 className="font-bold text-white text-sm">Quick Wins</h3>
                  <span className="text-xs text-slate-500">Act on these first</span>
                </div>
                <div className="space-y-2.5">
                  {quickWins.map((win, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 bg-emerald-600/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-400 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-300 leading-relaxed">{win}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key risks */}
            {keyRisks.length > 0 && (
              <div className="bg-red-950/25 border border-red-500/15 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-400 text-lg">⚠️</span>
                  <h3 className="font-bold text-white text-sm">Key Risks</h3>
                  <span className="text-xs text-slate-500">Monitor closely</span>
                </div>
                <div className="space-y-2.5">
                  {keyRisks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">→</span>
                      <span className="text-sm text-slate-300 leading-relaxed">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: SWOT */}
        {activeTab === "swot" && kitchen.swot && (
          <SwotGrid swot={kitchen.swot} />
        )}

        {/* Tab: Roadmap */}
        {activeTab === "roadmap" && kitchen.roadmap?.length > 0 && (
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
            <div className="mb-5">
              <h3 className="font-bold text-white text-sm">12-Month Execution Plan</h3>
              <p className="text-xs text-slate-400 mt-1">Tap each phase to expand tasks and milestones</p>
            </div>
            <RoadmapTimeline roadmap={kitchen.roadmap} />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-white/5">
          <Link
            href="/dashboard"
            className="flex-1 text-center py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-medium transition-all"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/#calculator"
            className="flex-1 text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
          >
            + New Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}

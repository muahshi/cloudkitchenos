"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type KitchenType =
  | "ghost_kitchen"
  | "shared_kitchen"
  | "home_kitchen"
  | "cloud_kitchen_franchise";

interface FeasibilityInput {
  location: string;
  budget: number;
  kitchenType: KitchenType;
  cuisine: string;
}

interface SwotAnalysis {
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

interface FeasibilityResult {
  feasibilityScore: number;
  verdict: string;
  summary: string;
  swot: SwotAnalysis;
  roadmap: RoadmapPhase[];
  estimatedMonthlyRevenue: string;
  estimatedBreakeven: string;
  keyRisks: string[];
  quickWins: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const KITCHEN_OPTIONS = [
  { value: "ghost_kitchen", label: "Ghost Kitchen", icon: "👻", desc: "Delivery-only, no dine-in. Lowest overhead.", budget: "₹2–5L" },
  { value: "shared_kitchen", label: "Shared Kitchen", icon: "🤝", desc: "Rent a licensed commercial space by hour.", budget: "₹50K–1L" },
  { value: "home_kitchen", label: "Home Kitchen", icon: "🏠", desc: "Start from home with FSSAI registration.", budget: "₹20–50K" },
  { value: "cloud_kitchen_franchise", label: "Cloud Franchise", icon: "🏢", desc: "Buy into an established brand.", budget: "₹5–20L" },
];

const CUISINE_TAGS = [
  "North Indian", "South Indian", "Chinese", "Biryani",
  "Pizza", "Burgers", "Healthy Bowls", "Thali",
  "Rolls & Wraps", "Momos", "Desserts", "Multi-cuisine",
];

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
  "Pune", "Bhopal", "Indore", "Jaipur", "Lucknow",
];

const STEPS = [
  { id: 1, label: "Location", icon: "📍" },
  { id: 2, label: "Budget", icon: "💰" },
  { id: 3, label: "Model", icon: "🏭" },
  { id: 4, label: "Cuisine", icon: "🍽️" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Bhopal", text: "Started with ₹1.8L. Hit ₹90K/month in 4 months. CloudKitchenOS mapped every step.", avatar: "PS", rating: 5 },
  { name: "Arjun Mehta", city: "Pune", text: "The AI feasibility score told me exactly what my competition research missed. Saved me from a bad location.", avatar: "AM", rating: 5 },
  { name: "Sneha Reddy", city: "Hyderabad", text: "Ghost kitchen for biryanis. Score was 82/100. Now doing 150+ orders/day on Swiggy.", avatar: "SR", rating: 5 },
];

const STATS = [
  { value: "2,400+", label: "Kitchens Analyzed" },
  { value: "₹12Cr+", label: "Revenue Generated" },
  { value: "87%", label: "Accuracy Rate" },
  { value: "4.8★", label: "Founder Rating" },
];

// ─────────────────────────────────────────────────────────────────────────────
// GROQ MOCK (replace with real API call in prod)
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeWithGroq(input: FeasibilityInput): Promise<FeasibilityResult> {
  // In production, this calls /api/analyze
  // For the artifact demo, we generate a realistic mock
  await new Promise((r) => setTimeout(r, 2800));
  
  const score = Math.floor(55 + Math.random() * 35);
  const budgetK = Math.round(input.budget / 1000);
  
  return {
    feasibilityScore: score,
    verdict: score >= 75 ? "Highly Feasible" : score >= 60 ? "Feasible" : "Risky",
    summary: `A ${input.kitchenType.replace(/_/g, " ")} serving ${input.cuisine} in ${input.location} shows ${score >= 70 ? "strong" : "moderate"} viability with your ₹${budgetK}K budget. The local delivery market presents real opportunity, especially on Swiggy and Zomato, but competition and platform margins require careful unit economics from Day 1.`,
    swot: {
      strengths: [
        `${input.cuisine} is a high-demand category in ${input.location}`,
        "Low overhead vs traditional restaurant model",
        "Direct access to Swiggy/Zomato customer base",
        `Budget of ₹${budgetK}K covers initial setup comfortably`,
      ],
      weaknesses: [
        "No physical brand visibility or walk-in traffic",
        "25–30% platform commission reduces margins",
        "Initial ratings build-up takes 60–90 days",
        "Kitchen equipment depreciation over 3–5 years",
      ],
      opportunities: [
        `Post-COVID delivery adoption still rising in ${input.location}`,
        "Corporate lunch delivery segment underserved",
        "WhatsApp direct ordering can bypass platform fees",
        "Instagram food content drives organic discovery",
      ],
      threats: [
        "Increasing competition in cloud kitchen segment",
        "Ingredient cost inflation (8–12% annually)",
        "Zomato/Swiggy algorithm changes affect visibility",
        "FSSAI compliance requirements evolving",
      ],
    },
    roadmap: [
      {
        phase: 1,
        title: "Setup & Compliance",
        duration: "Month 1–2",
        tasks: ["FSSAI basic/state registration", "Kitchen space setup", "Equipment procurement", "Menu finalization & costing", "Swiggy/Zomato onboarding"],
        estimatedCost: `₹${Math.round(budgetK * 0.4)}K`,
        milestone: "First order received",
      },
      {
        phase: 2,
        title: "Launch & Growth",
        duration: "Month 3–5",
        tasks: ["Discount campaigns on platforms", "Instagram & Google My Business setup", "Review management system", "Packaging brand identity", "Hire 1 cook + delivery coordinator"],
        estimatedCost: `₹${Math.round(budgetK * 0.25)}K`,
        milestone: "50 orders/day consistently",
      },
      {
        phase: 3,
        title: "Optimization",
        duration: "Month 6–9",
        tasks: ["Menu A/B testing", "High-margin items push", "WhatsApp ordering setup", "Corporate tieups (offices/hostels)", "Inventory management system"],
        estimatedCost: `₹${Math.round(budgetK * 0.2)}K`,
        milestone: "Break-even reached",
      },
      {
        phase: 4,
        title: "Scale",
        duration: "Month 10–12",
        tasks: ["Second virtual brand launch", "Catering vertical", "Subscription meal plans", "Explore 2nd location feasibility"],
        estimatedCost: `₹${Math.round(budgetK * 0.15)}K`,
        milestone: "₹1L+/month net profit",
      },
    ],
    estimatedMonthlyRevenue: `₹${Math.round(budgetK * 0.8)}K – ₹${Math.round(budgetK * 1.4)}K`,
    estimatedBreakeven: score >= 72 ? "5–7 months" : "8–12 months",
    keyRisks: [
      "Platform dependency — build direct channels early",
      "Food quality consistency at scale",
      "Working capital management during slow months",
    ],
    quickWins: [
      "List on both Swiggy & Zomato from Day 1",
      "Run 40% off for first 2 weeks to boost ratings",
      "Create Instagram reels of food prep — goes viral often",
      "Partner with 2–3 local offices for bulk lunch orders",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPEWRITER HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 18, active = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active || !text) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);

  return { displayed, done };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE RING COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const [animated, setAnimated] = useState(0);
  
  useEffect(() => {
    const t = setTimeout(() => {
      let s = 0;
      const step = setInterval(() => {
        s += 2;
        setAnimated(Math.min(s, score));
        if (s >= score) clearInterval(step);
      }, 20);
    }, 400);
    return () => clearTimeout(t);
  }, [score]);

  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (animated / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 60 ? "#6366f1" : "#f59e0b";
  const verdictColor = score >= 75 ? "text-emerald-400" : score >= 60 ? "text-indigo-400" : "text-amber-400";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white leading-none">{animated}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-bold tracking-wide uppercase ${verdictColor}`}>{verdict}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SWOT CARD
// ─────────────────────────────────────────────────────────────────────────────
function SwotCard({ label, items, color, bg }: {
  label: string; items: string[]; color: string; bg: string;
}) {
  return (
    <div className={`rounded-xl p-4 ${bg} border border-white/5`}>
      <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${color}`}>{label}</div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-300 text-xs leading-relaxed">
            <span className={`mt-0.5 text-[8px] ${color}`}>◆</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROADMAP PHASE
// ─────────────────────────────────────────────────────────────────────────────
function RoadmapItem({ phase, isLast }: { phase: RoadmapPhase; isLast: boolean }) {
  const [open, setOpen] = useState(phase.phase === 1);
  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 to-transparent" />
      )}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
        <span className="text-indigo-400 font-bold text-sm">{phase.phase}</span>
      </div>
      <div className="flex-1 pb-6">
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left flex items-center justify-between group"
        >
          <div>
            <div className="font-semibold text-white text-sm">{phase.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{phase.duration} · {phase.estimatedCost}</div>
          </div>
          <span className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </button>
        {open && (
          <div className="mt-3 space-y-1.5">
            {phase.tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-emerald-500">✓</span>
                {task}
              </div>
            ))}
            <div className="mt-2 text-xs text-indigo-400 font-medium">
              🎯 Milestone: {phase.milestone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULT PANEL
// ─────────────────────────────────────────────────────────────────────────────
function ResultPanel({ result, onReset }: { result: FeasibilityResult; onReset: () => void }) {
  const { displayed, done } = useTypewriter(result.summary, 16, true);
  const [tab, setTab] = useState<"swot" | "roadmap" | "actions">("swot");

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-800/60 border border-white/5 backdrop-blur">
        <ScoreRing score={result.feasibilityScore} verdict={result.verdict} />
        <div className="flex-1 text-center sm:text-left">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-2">AI Feasibility Analysis</div>
          <p className="text-slate-200 text-sm leading-relaxed min-h-[60px]">
            {displayed}
            {!done && <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse" />}
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="text-center">
              <div className="text-emerald-400 font-bold text-sm">{result.estimatedMonthlyRevenue}</div>
              <div className="text-xs text-slate-500">Est. Monthly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 font-bold text-sm">{result.estimatedBreakeven}</div>
              <div className="text-xs text-slate-500">Break-even Timeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl">
        {(["swot", "roadmap", "actions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all capitalize ${
              tab === t
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t === "swot" ? "SWOT" : t === "roadmap" ? "Roadmap" : "Quick Wins"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "swot" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SwotCard label="Strengths" items={result.swot.strengths} color="text-emerald-400" bg="bg-emerald-950/40" />
          <SwotCard label="Weaknesses" items={result.swot.weaknesses} color="text-red-400" bg="bg-red-950/40" />
          <SwotCard label="Opportunities" items={result.swot.opportunities} color="text-blue-400" bg="bg-blue-950/40" />
          <SwotCard label="Threats" items={result.swot.threats} color="text-amber-400" bg="bg-amber-950/40" />
        </div>
      )}

      {tab === "roadmap" && (
        <div className="bg-slate-800/40 rounded-2xl p-5 border border-white/5">
          <div className="text-xs text-slate-400 mb-4 font-medium">Your 12-month cloud kitchen roadmap</div>
          {result.roadmap.map((phase, i) => (
            <RoadmapItem key={phase.phase} phase={phase} isLast={i === result.roadmap.length - 1} />
          ))}
        </div>
      )}

      {tab === "actions" && (
        <div className="space-y-3">
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">⚡ Quick Wins</div>
            {result.quickWins.map((win, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300 mb-2">
                <span className="text-emerald-500 font-bold">{i + 1}.</span>
                {win}
              </div>
            ))}
          </div>
          <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4">
            <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">⚠️ Key Risks to Watch</div>
            {result.keyRisks.map((risk, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300 mb-2">
                <span className="text-red-500">→</span>
                {risk}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-2xl overflow-hidden border border-indigo-500/30">
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 p-5 text-center">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-2">Unlock Full Report</div>
          <div className="text-white font-bold text-lg mb-1">Get the complete PRO toolkit</div>
          <div className="text-slate-400 text-sm mb-4">FSSAI guide · GST setup · Vendor contacts · Financial model</div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25 text-sm">
              🚀 Unlock PRO — ₹1,499
            </button>
            <button
              onClick={onReset}
              className="border border-slate-700 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all text-sm"
            >
              Analyze Another Kitchen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALCULATOR STEPS
// ─────────────────────────────────────────────────────────────────────────────
function StepLocation({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">City or Area</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Bhopal, Koramangala Bengaluru..."
          className="w-full bg-slate-800/80 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-all text-sm"
        />
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-2">Popular cities</div>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => onChange(city)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                value === city
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBudget({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const formatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  const brackets = [
    { label: "₹50K", value: 50000 },
    { label: "₹1L", value: 100000 },
    { label: "₹2L", value: 200000 },
    { label: "₹5L", value: 500000 },
    { label: "₹10L", value: 1000000 },
    { label: "₹20L+", value: 2000000 },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center py-4 bg-slate-800/60 rounded-2xl border border-slate-700">
        <div className="text-3xl font-black text-white">{formatted}</div>
        <div className="text-xs text-slate-400 mt-1">Investment Budget</div>
      </div>
      <div>
        <input
          type="range"
          min={50000}
          max={5000000}
          step={50000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>₹50K</span>
          <span>₹50L</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {brackets.map((b) => (
          <button
            key={b.label}
            onClick={() => onChange(b.value)}
            className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
              value === b.value
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepKitchenType({ value, onChange }: { value: KitchenType; onChange: (v: KitchenType) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {KITCHEN_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value as KitchenType)}
          className={`text-left p-4 rounded-xl border transition-all ${
            value === opt.value
              ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30"
              : "border-slate-700 hover:border-slate-500 bg-slate-800/40"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <div className="font-semibold text-white text-sm">{opt.label}</div>
              <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{opt.desc}</div>
              <div className="text-xs text-indigo-400 font-medium mt-1">{opt.budget}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function StepCuisine({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Your Cuisine</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Biryani, Pizza, South Indian..."
          className="w-full bg-slate-800/80 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-all text-sm"
        />
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-2">Quick select</div>
        <div className="flex flex-wrap gap-2">
          {CUISINE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onChange(tag)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                value === tag
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CALCULATOR CARD
// ─────────────────────────────────────────────────────────────────────────────
function Calculator() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<FeasibilityInput>({
    location: "",
    budget: 300000,
    kitchenType: "ghost_kitchen",
    cuisine: "",
  });
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof FeasibilityInput>(k: K, v: FeasibilityInput[K]) => {
    setInput((p) => ({ ...p, [k]: v }));
    setError(null);
  };

  const validate = () => {
    if (step === 1 && input.location.trim().length < 2) return "Enter a valid city or area.";
    if (step === 2 && input.budget < 50000) return "Minimum budget is ₹50,000.";
    if (step === 3 && !input.kitchenType) return "Select a kitchen type.";
    if (step === 4 && input.cuisine.trim().length < 2) return "Enter your cuisine type.";
    return null;
  };

  const handleNext = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleAnalyze = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeWithGroq(input);
      setResult(res);
    } catch (e) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setResult(null);
    setError(null);
    setLoading(false);
    setInput({ location: "", budget: 300000, kitchenType: "ghost_kitchen", cuisine: "" });
  };

  const stepTitles = [
    "Where will your kitchen be?",
    "What's your investment?",
    "Choose your kitchen model",
    "What will you cook?",
  ];

  const stepSubtitles = [
    "Location impacts competition, rent, and delivery radius",
    "We'll analyse ROI and break-even for your budget",
    "Each model has different cost & compliance needs",
    "Menu focus affects platform rankings and margins",
  ];

  if (result) return <ResultPanel result={result} onReset={reset} />;

  return (
    <div className="space-y-6">
      {/* Step progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => step > s.id && setStep(s.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                step === s.id
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-400/40 ring-offset-2 ring-offset-slate-900"
                  : step > s.id
                  ? "bg-emerald-600/80 text-white cursor-pointer hover:bg-emerald-500"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {step > s.id ? "✓" : s.id}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s.id ? "bg-emerald-600/60" : "bg-slate-700"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 -mt-4 px-1">
        {STEPS.map((s) => (
          <span key={s.id} className={`transition-colors ${step === s.id ? "text-indigo-400 font-medium" : ""}`}>{s.label}</span>
        ))}
      </div>

      {/* Step header */}
      <div>
        <div className="text-white font-bold text-lg leading-tight">{stepTitles[step - 1]}</div>
        <div className="text-slate-400 text-sm mt-1">{stepSubtitles[step - 1]}</div>
      </div>

      {/* Step content */}
      <div>
        {step === 1 && <StepLocation value={input.location} onChange={(v) => updateField("location", v)} />}
        {step === 2 && <StepBudget value={input.budget} onChange={(v) => updateField("budget", v)} />}
        {step === 3 && <StepKitchenType value={input.kitchenType} onChange={(v) => updateField("kitchenType", v)} />}
        {step === 4 && <StepCuisine value={input.cuisine} onChange={(v) => updateField("cuisine", v)} />}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          <span className="text-red-400 text-sm">⚠ {error}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => { setStep((s) => s - 1); setError(null); }}
            className="flex-1 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:border-slate-500 hover:text-white transition-all text-sm"
          >
            ← Back
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all text-sm"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI...
              </span>
            ) : (
              "🚀 Analyze My Kitchen"
            )}
          </button>
        )}
      </div>

      {step === 4 && !loading && (
        <p className="text-center text-xs text-slate-500">
          Powered by Llama 3 via Groq · Results in ~3 seconds
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CloudKitchenOSPage() {
  const calcRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const scrollToCalc = () => calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans" style={{ fontFamily: "'DM Sans', 'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Sora:wght@700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes grain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 30%{transform:translate(3%,2%)} 50%{transform:translate(-1%,4%)} 70%{transform:translate(2%,-2%)} 90%{transform:translate(-3%,1%)} }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease forwards; }
        .bg-noise::before { content:''; position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E"); pointer-events:none; z-index:0; animation: grain 8s steps(2) infinite; }
        .glass { background: rgba(15,23,42,0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        input[type=range]::-webkit-slider-thumb { width:20px; height:20px; background:#6366f1; border-radius:50%; cursor:pointer; border: 2px solid #818cf8; }
        input[type=range]::-webkit-slider-track { background: transparent; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/5" : ""}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">CK</span>
            </div>
            <span className="font-bold text-white text-sm tracking-tight">CloudKitchenOS</span>
            <span className="hidden sm:block text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">BETA</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#calculator" onClick={(e) => { e.preventDefault(); scrollToCalc(); }} className="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">Calculator</a>
            <a href="#pricing" className="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
            <button
              onClick={scrollToCalc}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              Try Free →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative bg-noise pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Mesh gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-indigo-500/6 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-indigo-300 font-semibold">AI-Powered · 2,400+ Kitchens Analyzed</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
            Start Your{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Cloud Kitchen</span>
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400/50 to-emerald-400/50" />
            </span>
            {" "}Business with AI
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Answer 4 questions. Get a complete feasibility score, SWOT analysis, and 12-month roadmap — powered by Llama 3. Free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCalc}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-2xl text-base transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              🚀 Check Feasibility — Free
            </button>
            <div className="text-slate-500 text-sm">No account needed · Takes 60 seconds</div>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10">
            {["FSSAI Compliant Guidance", "Zomato/Swiggy Insights", "Real Indian Market Data"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="text-emerald-500">✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Calculator Section ── */}
      <section id="calculator" ref={calcRef} className="py-16 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-3">Free AI Feasibility Calculator</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
              Is Your Idea Viable?
            </h2>
            <p className="text-slate-400 text-sm mt-2">Get your score in under 60 seconds</p>
          </div>

          {/* Glass card */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5" />
            <div className="absolute inset-0 border border-white/8 rounded-3xl pointer-events-none" />
            <div className="relative glass rounded-3xl p-6 sm:p-8">
              <Calculator />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "'Sora', sans-serif" }}>How It Works</h2>
            <p className="text-slate-400 text-sm mt-2">From idea to actionable roadmap in 3 steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "📝", title: "Answer 4 Questions", desc: "Location, budget, kitchen model, and cuisine. That's it." },
              { step: "02", icon: "🤖", title: "AI Analyzes Market", desc: "Llama 3 processes Indian market data, platform dynamics, and compliance needs." },
              { step: "03", icon: "📊", title: "Get Your Roadmap", desc: "Feasibility score, SWOT, 4-phase plan, revenue projections — ready to act." },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/20 transition-all group">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs text-indigo-400/50 font-black mb-1">{item.step}</div>
                <div className="font-bold text-white mb-2 text-sm">{item.title}</div>
                <div className="text-slate-400 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bhopal Case Study ── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-indigo-500/20">
            <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-2xl">📍</div>
                </div>
                <div>
                  <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-2">Case Study · Bhopal</div>
                  <h3 className="text-xl font-black text-white mb-3">₹1.8L to ₹90K/month — A Ghost Kitchen Story</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Rahul started a biryani ghost kitchen in Bhopal's MP Nagar with just ₹1.8 lakh. CloudKitchenOS gave him a 78/100 score and flagged the Hostel Belt opportunity. Today he runs 3 virtual brands from the same kitchen.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { label: "Investment", value: "₹1.8L" },
                      { label: "Month 4 Revenue", value: "₹90K" },
                      { label: "Daily Orders", value: "130+" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="text-lg font-black text-emerald-400">{m.value}</div>
                        <div className="text-xs text-slate-500">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <a href="/blog/bhopal-cloud-kitchen-case-study" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                    Read Full Case Study →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/40">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-3">Founder Stories</div>
          <h2 className="text-2xl font-black text-white mb-10" style={{ fontFamily: "'Sora', sans-serif" }}>Real Founders. Real Results.</h2>
          <div className="relative overflow-hidden rounded-2xl bg-slate-800/40 border border-white/5 p-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="transition-all duration-500"
                style={{
                  opacity: i === activeTestimonial ? 1 : 0,
                  display: i === activeTestimonial ? "block" : "none",
                }}
              >
                <div className="text-3xl text-indigo-400/40 font-serif mb-4">"</div>
                <p className="text-slate-200 text-lg leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.city} · {"★".repeat(t.rating)}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? "bg-indigo-400 w-6" : "bg-slate-600"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-3">Simple Pricing</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "'Sora', sans-serif" }}>One Price. Everything Included.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl p-6 bg-slate-800/40 border border-white/5">
              <div className="text-sm font-bold text-slate-300 mb-4">Free</div>
              <div className="text-3xl font-black text-white mb-1">₹0</div>
              <div className="text-slate-400 text-xs mb-6">No credit card</div>
              <ul className="space-y-2 mb-6">
                {["AI Feasibility Score", "SWOT Analysis", "4-Phase Roadmap", "Revenue Projections"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-emerald-500 text-xs">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={scrollToCalc} className="w-full py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-semibold text-sm transition-all">
                Try Free
              </button>
            </div>
            {/* PRO */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 overflow-hidden">
              <div className="absolute top-4 right-4 text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-full font-bold">MOST POPULAR</div>
              <div className="text-sm font-bold text-indigo-300 mb-4">PRO Access</div>
              <div className="text-3xl font-black text-white mb-1">₹1,499 <span className="text-lg text-slate-400 font-normal line-through">₹4,999</span></div>
              <div className="text-slate-400 text-xs mb-6">One-time · Lifetime access</div>
              <ul className="space-y-2 mb-6">
                {[
                  "Everything in Free",
                  "FSSAI Step-by-Step Guide",
                  "GST Registration Walkthrough",
                  "Vendor Contact Database",
                  "Financial Model (Excel)",
                  "Bhopal + 5 City Case Studies",
                  "Day vs Night Kitchen Comparison",
                  "Priority Email Support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-indigo-400 text-xs">✦</span>{f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all">
                🚀 Get PRO Access — ₹1,499
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-black text-[10px]">CK</span>
                </div>
                <span className="font-bold text-white text-sm">CloudKitchenOS</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                India's first AI-powered cloud kitchen feasibility platform. Built for the next generation of food entrepreneurs.
              </p>
              <div className="flex gap-3 mt-4">
                {["Twitter", "Instagram", "LinkedIn"].map((s) => (
                  <a key={s} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{s}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Resources</div>
              <ul className="space-y-2">
                {[
                  { label: "Bhopal Case Study", href: "/blog/bhopal-cloud-kitchen-case-study" },
                  { label: "FSSAI Guide", href: "/blog/fssai-registration-guide" },
                  { label: "GST for Food", href: "/blog/gst-cloud-kitchen" },
                  { label: "Day vs Night Kitchen", href: "/blog/day-vs-night-cloud-kitchen" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Compliance</div>
              <ul className="space-y-2">
                {["FSSAI Registration", "GST Setup", "Fire NOC", "Trade License"].map((item) => (
                  <li key={item}>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="text-emerald-600 text-[8px]">●</span>{item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                <div className="text-xs text-amber-400 font-semibold mb-1">📋 FSSAI/GST Guide</div>
                <div className="text-[11px] text-slate-500">Step-by-step compliance checklist — included in PRO</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs text-slate-600">© 2025 CloudKitchenOS. Made with ☕ for Indian food entrepreneurs.</div>
            <div className="flex gap-4">
              {["Privacy", "Terms", "Refunds"].map((l) => (
                <a key={l} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

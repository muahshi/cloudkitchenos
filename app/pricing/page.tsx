"use client";

import { useState } from "react";
import Link from "next/link";

// ── Feature matrix ────────────────────────────────────────────────────────────
const FEATURES = [
  { label: "AI Feasibility Score (0–100)", free: true, pro: true },
  { label: "SWOT Analysis", free: true, pro: true },
  { label: "4-Phase Roadmap", free: true, pro: true },
  { label: "Revenue Projections", free: true, pro: true },
  { label: "Break-even Timeline", free: true, pro: true },
  { label: "Unlimited Analyses", free: false, pro: true },
  { label: "FSSAI Step-by-Step Guide", free: false, pro: true },
  { label: "GST Registration Walkthrough", free: false, pro: true },
  { label: "Vendor Contact Database (50+ suppliers)", free: false, pro: true },
  { label: "Financial Model (Excel template)", free: false, pro: true },
  { label: "Bhopal + 5 City Case Studies", free: false, pro: true },
  { label: "Day vs Night Kitchen Comparison", free: false, pro: true },
  { label: "Packaging & Branding Guide", free: false, pro: true },
  { label: "Swiggy/Zomato Ranking Playbook", free: false, pro: true },
  { label: "Priority Email Support (48hr)", free: false, pro: true },
];

const FAQS = [
  {
    q: "Is this a subscription or one-time payment?",
    a: "One-time payment of ₹1,499. You get lifetime access to all current and future PRO content.",
  },
  {
    q: "What payment methods are supported?",
    a: "UPI (GPay, PhonePe, Paytm), debit/credit cards, net banking — all via Razorpay. 100% secure.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes, within 7 days of purchase if you haven't downloaded the financial model or accessed the vendor database.",
  },
  {
    q: "Is the AI analysis actually free?",
    a: "Yes. The 4-step calculator with full SWOT and roadmap is completely free, no account required.",
  },
  {
    q: "Will this work for my city?",
    a: "The AI is trained on Indian market data and specifically accounts for Tier 1, 2, and 3 city dynamics, platform availability, and regional ingredient costs.",
  },
];

function CheckIcon({ active }: { active: boolean }) {
  return active ? (
    <span className="text-emerald-400 font-bold">✓</span>
  ) : (
    <span className="text-slate-700">—</span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-center justify-between gap-4"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        <span className={`text-slate-500 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <p className="text-sm text-slate-400 leading-relaxed pb-4">{a}</p>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    // In prod: call /api/payment/create-order → Razorpay checkout
    // For now, redirect to a placeholder
    await new Promise((r) => setTimeout(r, 800));
    alert("Razorpay integration: Connect your key in /api/payment/route.ts");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/3 w-[500px] h-[400px] bg-indigo-600/7 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-4 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-[10px]">CK</span>
            </div>
            <span className="font-bold text-white text-sm">CloudKitchenOS</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-xs text-slate-400 hover:text-white transition-colors hidden sm:block">Blog</Link>
            <Link href="/login" className="text-xs text-slate-400 hover:text-white transition-colors">Sign in</Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-3">
            Simple, Honest Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            One Price. Everything You Need.
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            The free calculator gets you started. PRO gets you launched.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {/* Free */}
          <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-7 flex flex-col">
            <div className="mb-6">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Free</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white">₹0</span>
              </div>
              <div className="text-xs text-slate-500">No account needed</div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {FEATURES.filter((f) => f.free).map((f) => (
                <li key={f.label} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckIcon active />
                  {f.label}
                </li>
              ))}
            </ul>

            <Link
              href="/#calculator"
              className="w-full text-center py-3.5 rounded-xl border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold text-sm transition-all"
            >
              Try Free Calculator
            </Link>
          </div>

          {/* PRO */}
          <div className="relative bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-7 flex flex-col overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-bl-xl rounded-tr-2xl uppercase tracking-widest">
              Most Popular
            </div>

            <div className="mb-6">
              <div className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-3">PRO Access</div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-black text-white">₹1,499</span>
                <span className="text-slate-500 line-through text-lg pb-1">₹4,999</span>
              </div>
              <div className="text-xs text-emerald-400 font-semibold">
                70% off · One-time · Lifetime access
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {FEATURES.map((f) => (
                <li
                  key={f.label}
                  className={`flex items-center gap-2.5 text-sm ${f.pro ? "text-slate-200" : "text-slate-600 line-through"}`}
                >
                  <CheckIcon active={f.pro} />
                  {f.label}
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Preparing checkout...
                </span>
              ) : (
                "🚀 Get PRO Access — ₹1,499"
              )}
            </button>

            {/* Payment trust */}
            <div className="flex items-center justify-center gap-3 mt-3">
              {["UPI", "Cards", "Net Banking"].map((m) => (
                <span key={m} className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Full comparison table (desktop) */}
        <div className="hidden sm:block mb-16">
          <h2 className="text-lg font-black text-white text-center mb-6">
            Full Feature Comparison
          </h2>
          <div className="bg-slate-800/30 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-widest w-full">
                    Feature
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Free
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-indigo-400 uppercase tracking-widest whitespace-nowrap">
                    PRO
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, i) => (
                  <tr
                    key={feature.label}
                    className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? "bg-slate-800/10" : ""}`}
                  >
                    <td className="py-3 px-5 text-sm text-slate-300">{feature.label}</td>
                    <td className="py-3 px-5 text-center">
                      <CheckIcon active={feature.free} />
                    </td>
                    <td className="py-3 px-5 text-center">
                      <CheckIcon active={feature.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
          {[
            { value: "2,400+", label: "Kitchens analyzed" },
            { value: "4.8/5", label: "Founder rating" },
            { value: "7-day", label: "Refund guarantee" },
            { value: "₹0", label: "Hidden fees" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-white text-center mb-6">Frequently Asked Questions</h2>
          <div className="bg-slate-800/30 border border-white/5 rounded-2xl px-5">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 text-sm mb-4">
            Not ready for PRO yet? The free calculator still gives you everything to validate your idea.
          </p>
          <Link
            href="/#calculator"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
          >
            Try the free calculator → 
          </Link>
        </div>
      </div>
    </div>
  );
}

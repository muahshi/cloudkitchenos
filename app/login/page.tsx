"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmail, signUpWithEmail } from "@/lib/supabase";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        router.push("/dashboard");
      } else {
        if (password.length < 8) {
          setError("Password must be at least 8 characters.");
          return;
        }
        await signUpWithEmail(email, password, { full_name: fullName });
        setSuccess(
          "Account created! Check your email to confirm, then sign in."
        );
        setMode("login");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      // Clean up Supabase error messages
      if (msg.includes("Invalid login credentials"))
        setError("Wrong email or password.");
      else if (msg.includes("User already registered"))
        setError("An account with this email already exists. Please sign in.");
      else if (msg.includes("Email not confirmed"))
        setError("Please confirm your email first. Check your inbox.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      {/* Back link */}
      <div className="relative z-10 p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-black text-[10px]">CK</span>
          </div>
          <span className="font-bold">CloudKitchenOS</span>
        </Link>
      </div>

      {/* Form card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-slate-400 text-sm">
              {mode === "login"
                ? "Sign in to access your kitchen analyses"
                : "Start building your cloud kitchen today"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-slate-800/60 rounded-xl mb-6">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    mode === m
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name (signup only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Rahul Verma"
                    className="w-full bg-slate-800/80 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-all text-sm"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="rahul@example.com"
                  className="w-full bg-slate-800/80 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-all text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                  minLength={mode === "signup" ? 8 : 1}
                  className="w-full bg-slate-800/80 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-all text-sm"
                />
              </div>

              {/* Forgot password */}
              {mode === "login" && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <span className="text-red-400 text-xs leading-relaxed">⚠ {error}</span>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <span className="text-emerald-400 text-xs leading-relaxed">✓ {success}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : mode === "login" ? (
                  "Sign In →"
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Try free CTA */}
            <p className="text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/#calculator"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Try the free calculator first →
              </Link>
            </p>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-5 mt-6">
            {["🔒 Secure", "No spam", "Cancel anytime"].map((t) => (
              <span key={t} className="text-xs text-slate-600">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

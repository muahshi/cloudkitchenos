"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activePath?: string;
}

const NAV_LINKS = [
  { href: "/#calculator", label: "Calculator" },
  { href: "/blog", label: "Blog" },
  { href: "/#pricing", label: "Pricing" },
];

export function Navbar({ activePath = "/" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
              <span className="text-white font-black text-xs tracking-tighter">CK</span>
            </div>
            <div>
              <span className="font-black text-white text-sm tracking-tight">CloudKitchenOS</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-full font-bold">
                BETA
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activePath === link.href
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/#calculator"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              Try Free →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-200",
                mobileOpen && "rotate-45 translate-y-2"
              )}
            />
            <span
              className={cn(
                "w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-200",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-200",
                mobileOpen && "-rotate-45 -translate-y-2"
              )}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "sm:hidden overflow-hidden transition-all duration-300",
            mobileOpen ? "max-h-64 border-t border-white/5" : "max-h-0"
          )}
        >
          <div className="bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/5 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/#calculator"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 text-sm text-white font-bold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                Try Free
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

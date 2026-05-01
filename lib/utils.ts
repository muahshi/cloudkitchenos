import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Tailwind class merger ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Currency formatter (INR) ──────────────────────────────────────────────────
export function formatINR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Score utilities ───────────────────────────────────────────────────────────
export function getScoreColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 60) return "text-indigo-400";
  if (score >= 45) return "text-amber-400";
  return "text-red-400";
}

export function getScoreRingColor(score: number): string {
  if (score >= 75) return "#10b981";
  if (score >= 60) return "#6366f1";
  if (score >= 45) return "#f59e0b";
  return "#ef4444";
}

export function getScoreBg(score: number): string {
  if (score >= 75) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 60) return "bg-indigo-500/10 border-indigo-500/20";
  if (score >= 45) return "bg-amber-500/10 border-amber-500/20";
  return "bg-red-500/10 border-red-500/20";
}

export function getVerdict(score: number): string {
  if (score >= 75) return "Highly Feasible";
  if (score >= 60) return "Feasible";
  if (score >= 45) return "Risky";
  return "Not Recommended";
}

// ── Date formatter ────────────────────────────────────────────────────────────
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateString);
}

// ── Kitchen type label ────────────────────────────────────────────────────────
export function kitchenTypeLabel(type: string): string {
  const map: Record<string, string> = {
    ghost_kitchen: "Ghost Kitchen",
    shared_kitchen: "Shared Kitchen",
    home_kitchen: "Home Kitchen",
    cloud_kitchen_franchise: "Cloud Franchise",
  };
  return map[type] ?? type;
}

export function kitchenTypeIcon(type: string): string {
  const map: Record<string, string> = {
    ghost_kitchen: "👻",
    shared_kitchen: "🤝",
    home_kitchen: "🏠",
    cloud_kitchen_franchise: "🏢",
  };
  return map[type] ?? "🍽️";
}

// ── Clamp ─────────────────────────────────────────────────────────────────────
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ── Truncate ──────────────────────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

// ── Sleep (for dev/testing) ───────────────────────────────────────────────────
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

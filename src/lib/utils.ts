import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat("en-US", opts).format(n);
}

export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2) + "M";
  }
  if (Math.abs(n) >= 1_000) {
    return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + "k";
  }
  return n.toString();
}

export function formatCurrency(n: number, compact = false): string {
  if (compact) {
    return "$" + formatCompact(n);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPercent(n: number, digits = 1): string {
  return n.toFixed(digits) + "%";
}

export function relativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString();
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/* deterministic pseudo-random for stable demo data */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

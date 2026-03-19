// /lib/utils.ts
/**
 * Mist & Ember Exports – General Utilities
 *
 * A grab-bag of well-typed helpers used across the app:
 * - className merge (cn) with Tailwind support
 * - URLs, dates, text formatting, slugs
 * - numbers & currency (LKR by default)
 * - validation (email/phone), ids, sleep/debounce/throttle
 * - safe JSON, environment guards, scrolling helpers
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ---------------------------------------------
// Classnames / Tailwind
// ---------------------------------------------

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------
// Environment guards
// ---------------------------------------------

export const isBrowser = typeof window !== "undefined";
export const isServer = !isBrowser;

/** Read a public env var safely (Next.js exposes NEXT_PUBLIC_*). */
export function getEnv(key: string, fallback = ""): string {
  if (typeof process !== "undefined" && process.env && key in process.env) {
    return process.env[key] ?? fallback;
  }
  return fallback;
}

// ---------------------------------------------
// URLs
// ---------------------------------------------

/** Base site URL – change if needed or override with env. */
export const SITE_URL =
  getEnv("NEXT_PUBLIC_SITE_URL") ||
  "https://www.mistandember.com";

/** Build absolute URL from a path or return as-is if already absolute. */
export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Append query params to a URL in a type-safe way. */
export function withQuery(url: string, params?: Record<string, string | number | boolean | undefined | null>) {
  if (!params) return url;
  const u = new URL(absoluteUrl(url));
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    u.searchParams.set(k, String(v));
  }
  return u.toString();
}

// ---------------------------------------------
// Dates & Time
// ---------------------------------------------

export type DateInput = string | number | Date | undefined | null;

/** Convert input to Date or undefined if invalid. */
export function toDate(input: DateInput): Date | undefined {
  if (!input && input !== 0) return undefined;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(+d) ? undefined : d;
}

/** Format a date with Intl.DateTimeFormat (defaults to en-LK). */
export function formatDate(input: DateInput, opts: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
}) {
  const d = toDate(input);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-LK", opts).format(d);
}

/** ISO string (yyyy-mm-dd) for a date input. */
export function toISODate(input: DateInput) {
  const d = toDate(input);
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Simple reading time in minutes (float, 200wpm). */
export function readingTime(text: string, wpm = 200) {
  const words = (text.trim().match(/\S+/g) || []).length;
  return Math.max(0.1, words / Math.max(1, wpm));
}

// ---------------------------------------------
// Text helpers
// ---------------------------------------------

/** Slugify a string (URL-safe). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Reverse a simple slug to title-ish text. */
export function unslugify(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/** Truncate to max length with ellipsis. */
export function truncate(text: string, max = 140, ellipsis = "…") {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - ellipsis.length)).trimEnd() + ellipsis;
}

/** Truncate to N words. */
export function truncateWords(text: string, words = 24, ellipsis = "…") {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= words) return text.trim();
  return parts.slice(0, words).join(" ") + ellipsis;
}

/** Title Case (simple English heuristic). */
export function titleCase(input: string) {
  return input
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

/** Basic pluralization helper. */
export function pluralize(n: number, singular: string, plural = `${singular}s`) {
  return n === 1 ? singular : plural;
}

// ---------------------------------------------
// Numbers & Currency (LKR default)
// ---------------------------------------------

/** Format a number as currency; default LKR. */
export function formatCurrency(
  value: number,
  currency: string = "LKR",
  locale: string = "en-LK",
  opts: Intl.NumberFormatOptions = { style: "currency", currency }
) {
  return new Intl.NumberFormat(locale, opts).format(value);
}

/** Compact number (e.g., 12K). */
export function formatCompactNumber(n: number, locale = "en") {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

// ---------------------------------------------
// Validation
// ---------------------------------------------

export function isEmail(email: string): boolean {
  // Simple but practical email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Sri Lankan phone validation. Accepts "+94XXXXXXXXX" or "0XXXXXXXXX". */
export function isSriLankaPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return /^(\+94\d{9}|0\d{9})$/.test(cleaned);
}

// ---------------------------------------------
// JSON (safe)
// ---------------------------------------------

export const safeJSON = {
  parse<T = unknown>(s: string, fallback: T): T {
    try {
      return JSON.parse(s) as T;
    } catch {
      return fallback;
    }
  },
  stringify(obj: unknown, fallback = ""): string {
    try {
      return JSON.stringify(obj);
    } catch {
      return fallback;
    }
  },
};

// ---------------------------------------------
// Async / Timing
// ---------------------------------------------

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 200) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function throttle<T extends (...args: any[]) => void>(fn: T, ms = 200) {
  let last = 0;
  let pending: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      if (pending) {
        clearTimeout(pending);
        pending = null;
      }
      last = now;
      fn(...args);
    } else if (!pending) {
      pending = setTimeout(() => {
        last = Date.now();
        pending = null;
        fn(...args);
      }, remaining);
    }
  };
}

// ---------------------------------------------
// DOM / Scrolling (browser only)
// ---------------------------------------------

export function scrollToId(id: string, behavior: ScrollBehavior = "smooth", offset = 0) {
  if (!isBrowser) return;
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const top = rect.top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior });
}

export function scrollToHash(behavior: ScrollBehavior = "smooth", offset = 0) {
  if (!isBrowser) return;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;
  scrollToId(hash, behavior, offset);
}

// ---------------------------------------------
// IDs & Misc
// ---------------------------------------------

/** Simple unique id with prefix. */
export function randomId(prefix = "cr"): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36).slice(-4);
  return `${prefix}_${ts}${rnd}`;
}

/** Build a social/OG image URL (works with a hypothetical /api/og route). */
export function buildSocialImageUrl(params?: {
  title?: string;
  subtitle?: string;
  bg?: string;
}) {
  const title = encodeURIComponent(params?.title ?? "Mist & Ember Exports");
  const subtitle = encodeURIComponent(params?.subtitle ?? "Authentic Sri Lankan Journeys");
  const bg = encodeURIComponent(params?.bg ?? "/images/og-default.jpg");
  return withQuery("/api/og", { title, subtitle, bg });
}

/** Ensure we return a usable image URL (absolute when needed). */
export function getImageUrl(pathOrUrl?: string): string | undefined {
  if (!pathOrUrl) return undefined;
  return absoluteUrl(pathOrUrl);
}

// ---------------------------------------------
// Type helpers
// ---------------------------------------------

export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// ---------------------------------------------
// Default export bundle (optional convenience)
// ---------------------------------------------

export default {
  // env
  isBrowser,
  isServer,
  getEnv,
  // css
  cn,
  // urls
  SITE_URL,
  absoluteUrl,
  withQuery,
  // dates
  toDate,
  formatDate,
  toISODate,
  readingTime,
  // text
  slugify,
  unslugify,
  truncate,
  truncateWords,
  titleCase,
  pluralize,
  // numbers
  formatCurrency,
  formatCompactNumber,
  // validation
  isEmail,
  isSriLankaPhone,
  // json
  safeJSON,
  // async
  sleep,
  debounce,
  throttle,
  // dom
  scrollToId,
  scrollToHash,
  // misc
  randomId,
  buildSocialImageUrl,
  getImageUrl,
};

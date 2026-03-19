// /components/layout/theme-toggle.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ThemeToggle
 * -----------------------------------------------------------------------------
 * Lightweight client component to switch between Light and Dark themes.
 * - Persists user choice in localStorage ("theme": "light" | "dark")
 * - Respects system preference on first load
 * - Applies Tailwind "class" strategy by toggling the 'dark' class on <html>
 *
 * Tailwind config requirement:
 *   module.exports = { darkMode: "class", ... }
 */
type Theme = "light" | "dark";

export default function ThemeToggle({
  className = "",
  size = "md",
  tooltip = "Toggle theme",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  tooltip?: string;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const mqlRef = useRef<MediaQueryList | null>(null);

  // Decide initial theme on mount:
  //   - if user saved preference exists -> use it
  //   - else follow system preference
  useEffect(() => {
    setMounted(true);

    const stored = (typeof window !== "undefined" &&
      (localStorage.getItem("theme") as Theme | null)) as Theme | null;

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);

    // Watch system changes if user hasn't explicitly chosen (i.e., no stored)
    if (!stored && typeof window !== "undefined" && window.matchMedia) {
      mqlRef.current = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = (e: MediaQueryListEvent) => {
        const next = e.matches ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
      };
      mqlRef.current.addEventListener?.("change", onChange);
      return () => mqlRef.current?.removeEventListener?.("change", onChange);
    }
  }, []);

  function applyTheme(next: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // Toggle Tailwind's class strategy
    root.classList.toggle("dark", next === "dark");
    // Optional: expose current theme for CSS hooks
    root.setAttribute("data-theme", next);
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore quota issues
    }
  }

  // Button sizing
  const dims =
    size === "lg"
      ? "h-11 w-11 text-base"
      : size === "sm"
      ? "h-8 w-8 text-xs"
      : "h-9 w-9 text-sm";

  // Avoid hydration mismatch for icon rendering
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      title={tooltip}
      aria-label={tooltip}
      aria-pressed={isDark}
      className={[
        "inline-flex items-center justify-center rounded-xl border transition",
        "border-[#083335] text-[#083335] hover:bg-[#083335] hover:text-white",
        "dark:border-[#F6F3EE] dark:text-[#F6F3EE] dark:hover:bg-[#F6F3EE] dark:hover:text-[#083335]",
        dims,
        className,
      ].join(" ")}
    >
      {/* Sun / Moon icon swap (no external deps) */}
      <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/* ------------------------------ Inline Icons ------------------------------ */

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Zm0-11a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
      <path d="M12 2a1 1 0 0 1 1 1v1.25a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm0 16.75a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.25a1 1 0 0 1 1-1ZM21 11a1 1 0 1 1 0 2h-1.25a1 1 0 1 1 0-2H21ZM4.25 11a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h1.25ZM18.364 5.636a1 1 0 1 1 1.414 1.414l-.884.884a1 1 0 0 1-1.414-1.414l.884-.884Zm-12.258.884A1 1 0 1 1 4.692 5.19l.884-.884A1 1 0 0 1 6.99 5.72l-.884.8Zm11.374 11.374a1 1 0 0 1 1.414 1.414l-.884.884a1 1 0 1 1-1.414-1.414l.884-.884ZM6.106 17.254a1 1 0 0 1 1.414 1.414l-.884.884A1 1 0 0 1 5.222 18.138l.884-.884Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
    </svg>
  );
}

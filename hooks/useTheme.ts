// /hooks/useTheme.ts
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

/**
 * Theme hook for Ceylon Roots.
 * - Supports "light" | "dark" | "system"
 * - Persists choice to localStorage
 * - Syncs across tabs via "storage" event
 * - Applies/removes the `dark` class on <html> for Tailwind
 * - SSR-safe (guards for window/document)
 */

type ThemeMode = "light" | "dark" | "system";

type UseThemeOptions = {
  /** LocalStorage key. Default: "cr-theme" */
  storageKey?: string;
  /** If true, also sets `data-theme="<resolved>"` on <html> (useful for some UI kits) */
  setDataAttribute?: boolean;
  /** Force immediate class application during first effect to reduce FOUC */
  eagerApply?: boolean;
};

type UseThemeReturn = {
  /** Current selected mode (light | dark | system) */
  theme: ThemeMode;
  /** The actual theme the UI is using after resolving "system" */
  resolvedTheme: Exclude<ThemeMode, "system">;
  /** Set explicit mode */
  setTheme: (mode: ThemeMode) => void;
  /** Toggle between light and dark (system becomes dark) */
  toggleTheme: () => void;
  /** Convenience boolean */
  isDark: boolean;
  /** True after first client render/resolve */
  mounted: boolean;
};

const DEFAULT_STORAGE_KEY = "cr-theme";

const canUseDOM = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

/** Read system preference (dark?) */
const getSystemPrefersDark = (): boolean => {
  if (!canUseDOM()) return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
};

/** Read saved theme from localStorage */
const getStoredTheme = (key: string): ThemeMode | null => {
  if (!canUseDOM()) return null;
  try {
    const v = window.localStorage.getItem(key);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // ignore
  }
  return null;
};

/** Persist theme to localStorage */
const setStoredTheme = (key: string, value: ThemeMode) => {
  if (!canUseDOM()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

/** Apply/remove DOM attributes for Tailwind ("dark" class) and optional data-theme */
const applyDomTheme = (
  resolved: "light" | "dark",
  setDataAttribute: boolean
) => {
  if (!canUseDOM()) return;
  const root = document.documentElement;

  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  if (setDataAttribute) {
    root.setAttribute("data-theme", resolved);
  }
};

export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    setDataAttribute = true,
    eagerApply = true,
  } = options;

  // Initial theme read (no SSR flash: we don't depend on DOM here)
  const initialTheme = useMemo<ThemeMode>(() => {
    return getStoredTheme(storageKey) ?? "system";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);
  const [mounted, setMounted] = useState<boolean>(false);

  const computeResolved = useCallback(
    (mode: ThemeMode): Exclude<ThemeMode, "system"> => {
      if (mode === "system") {
        return getSystemPrefersDark() ? "dark" : "light";
      }
      return mode;
    },
    []
  );

  const resolvedTheme = useMemo<"light" | "dark">(
    () => computeResolved(theme),
    [computeResolved, theme]
  );

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode);
      setStoredTheme(storageKey, mode);
    },
    [storageKey]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" || (theme === "system" && getSystemPrefersDark()) ? "light" : "dark");
  }, [setTheme, theme]);

  // Apply DOM side-effects when theme or system preference changes
  const apply = useCallback(() => {
    const resolved = computeResolved(theme);
    applyDomTheme(resolved, setDataAttribute);
  }, [computeResolved, setDataAttribute, theme]);

  // Eager apply to reduce flash (layout effect runs before paint)
  const useIsoLayoutEffect = canUseDOM() ? useLayoutEffect : useEffect;

  useIsoLayoutEffect(() => {
    if (!canUseDOM()) return;

    // On first mount, if nothing stored, write initial to storage to keep tabs consistent
    if (getStoredTheme(storageKey) === null) {
      setStoredTheme(storageKey, theme);
    }

    if (eagerApply) apply(); // reduce FOUC
    setMounted(true);

    // Listen to system preference changes when on system mode
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") apply();
    };
    mql?.addEventListener?.("change", onChange);

    // Listen to other tabs updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const next = (e.newValue as ThemeMode) || "system";
        setThemeState(next);
        // Apply immediately to keep in sync
        const resolved = computeResolved(next);
        applyDomTheme(resolved, setDataAttribute);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mql?.removeEventListener?.("change", onChange);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-apply when dependencies change after mount (e.g., user switched from system to light)
  useEffect(() => {
    if (!mounted) return;
    apply();
  }, [apply, mounted]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === "dark",
    mounted,
  };
}

export default useTheme;

/* ----------------------------------------------------------------------
   OPTIONAL: If you want to eliminate theme flash even before React loads,
   you can paste the following inline script in <head> of your root layout:

   <script>
     (function () {
       try {
         var key = 'cr-theme';
         var v = localStorage.getItem(key);
         var mql = window.matchMedia('(prefers-color-scheme: dark)');
         var mode = (v === 'light' || v === 'dark' || v === 'system') ? v : 'system';
         var resolved = mode === 'system' ? (mql.matches ? 'dark' : 'light') : mode;
         var root = document.documentElement;
         if (resolved === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
         root.setAttribute('data-theme', resolved);
       } catch (e) {}
     })();
   </script>

   This matches the logic used in this hook (storageKey = "cr-theme").
---------------------------------------------------------------------- */

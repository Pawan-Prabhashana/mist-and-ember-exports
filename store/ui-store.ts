/**
 * 🌿 Ceylon Roots — UI Store
 * ---------------------------
 * Global UI state management using Zustand.
 *
 * Controls:
 *  - Theme (light / dark)
 *  - Mobile navigation visibility
 *  - Scroll lock
 *  - Modal (generic)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface UIState {
  // ——— Theme ———
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;

  // ——— Navigation ———
  isNavOpen: boolean;
  toggleNav: (state?: boolean) => void;

  // ——— Modal ———
  modal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  // ——— Scroll Lock ———
  isScrollLocked: boolean;
  setScrollLocked: (state: boolean) => void;
}

/**
 * Zustand store — persistent for theme, ephemeral for others.
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "system",
      setTheme: (mode) => {
        set({ theme: mode });
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          if (mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      },

      isNavOpen: false,
      toggleNav: (state) => {
        const newState = state ?? !get().isNavOpen;
        set({ isNavOpen: newState });

        // Optional: lock body scroll when nav is open
        if (typeof document !== "undefined") {
          document.body.style.overflow = newState ? "hidden" : "";
        }
      },

      modal: null,
      openModal: (id) => {
        set({ modal: id, isScrollLocked: true });
        if (typeof document !== "undefined") document.body.style.overflow = "hidden";
      },
      closeModal: () => {
        set({ modal: null, isScrollLocked: false });
        if (typeof document !== "undefined") document.body.style.overflow = "";
      },

      isScrollLocked: false,
      setScrollLocked: (state) => {
        set({ isScrollLocked: state });
        if (typeof document !== "undefined") {
          document.body.style.overflow = state ? "hidden" : "";
        }
      },
    }),
    {
      name: "ui-store", // localStorage key
      partialize: (state) => ({ theme: state.theme }), // persist only theme
    }
  )
);

import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  // -----------------------------------------------------
  // 🌿 Ceylon Roots — TailwindCSS Configuration
  // -----------------------------------------------------
  darkMode: "class", // supports .dark class toggling (via Zustand store)
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "./data/**/*.{json,js,ts}",
    "./styles/**/*.{css,ts}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      // -----------------------------------------------------
      // 🎨 Brand Colors
      // -----------------------------------------------------
      colors: {
        background: "var(--color-bg)",
        "background-alt": "var(--color-bg-alt)",
        text: "var(--color-text)",
        heading: "var(--color-heading)",
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "#74b886", // softer green
          dark: "#2e6748", // deep green
        },
        border: "var(--color-border)",
      },

      // -----------------------------------------------------
      // ✍️ Typography & Fonts
      // -----------------------------------------------------
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        serif: ["var(--font-serif)", ...fontFamily.serif],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        heading: ["var(--font-heading)", ...fontFamily.serif],
        body: ["var(--font-body)", ...fontFamily.sans],
      },

      // -----------------------------------------------------
      // 📏 Spacing & Layout
      // -----------------------------------------------------
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          sm: "2rem",
          lg: "3rem",
          xl: "4rem",
          "2xl": "5rem",
        },
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        glow: "0 0 40px rgba(58, 124, 89, 0.3)",
      },

      // -----------------------------------------------------
      // 🌀 Animations & Keyframes
      // -----------------------------------------------------
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.8", boxShadow: "0 0 10px #3a7c59" },
          "50%": { opacity: "1", boxShadow: "0 0 30px #74b886" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out forwards",
        fadeUp: "fadeUp 0.8s ease-out forwards",
        slideIn: "slideIn 0.8s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },

      // -----------------------------------------------------
      // 📖 Typography Plugin (Prose)
      // -----------------------------------------------------
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.text"),
            "--tw-prose-headings": theme("colors.heading"),
            "--tw-prose-links": theme("colors.accent.DEFAULT"),
            "--tw-prose-bold": theme("colors.heading"),
            "--tw-prose-quotes": theme("colors.accent.dark"),
            "--tw-prose-code": theme("colors.accent.dark"),
            "--tw-prose-hr": theme("colors.border"),
            a: {
              textDecoration: "none",
              "&:hover": {
                color: theme("colors.accent.dark"),
              },
            },
            code: {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "0.3rem",
              padding: "0.15rem 0.3rem",
            },
            blockquote: {
              borderLeftColor: theme("colors.accent.DEFAULT"),
              fontStyle: "italic",
            },
          },
        },
        dark: {
          css: {
            "--tw-prose-body": theme("colors.text"),
            "--tw-prose-headings": theme("colors.heading"),
            "--tw-prose-links": theme("colors.accent.light"),
            "--tw-prose-bold": theme("colors.heading"),
            "--tw-prose-quotes": theme("colors.accent.light"),
            "--tw-prose-code": theme("colors.accent.light"),
            "--tw-prose-hr": theme("colors.border"),
            code: {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
            blockquote: {
              borderLeftColor: theme("colors.accent.light"),
            },
          },
        },
      }),
    },
  },

  // -----------------------------------------------------
  // 🧩 Plugins
  // -----------------------------------------------------
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;

// /lib/seo/animations.ts
/**
 * Ceylon Roots – Animation presets with SEO & a11y in mind
 *
 * Why this file exists:
 * - Centralizes Framer Motion variants and transitions
 * - Honors prefers-reduced-motion to avoid motion sickness
 * - Provides reasonable defaults for page and section reveals
 *
 * Usage:
 *   import { m } from "framer-motion"; // or motion as m
 *   import { fadeInUp, staggerContainer, inViewOnce } from "@/lib/seo/animations";
 *
 *   <m.section variants={staggerContainer()} initial="hidden" whileInView="show" viewport={inViewOnce}>
 *     <m.h2 variants={fadeInUp()}>Headline</m.h2>
 *     <m.p variants={fadeIn()}>Body copy…</m.p>
 *   </m.section>
 */

import type { Transition, Variants } from "framer-motion";

/* -----------------------------------------------------------
 * Motion & environment helpers
 * --------------------------------------------------------- */

/** SSR-safe read of prefers-reduced-motion */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

/** If reduced motion is requested, neutralize animation-y parts */
export const maybeReduce = <T extends Variants | Transition>(value: T): T => {
  if (!prefersReducedMotion()) return value;
  // Simple strategy: remove opacity/transform transitions and set durations to 0
  const scrub = (v: any): any => {
    if (v == null || typeof v !== "object") return v;
    const out: any = Array.isArray(v) ? [] : {};
    for (const k of Object.keys(v)) {
      const val = (v as any)[k];
      if (k === "transition") {
        out[k] = { duration: 0 };
        continue;
      }
      if (["x", "y", "opacity", "scale", "rotate", "filter"].includes(k)) {
        // snap to final value if present
        if (k === "opacity") out[k] = v.opacity?.[v.opacity?.length - 1] ?? 1;
        else if (k === "scale") out[k] = v.scale?.[v.scale?.length - 1] ?? 1;
        else out[k] = 0;
        continue;
      }
      out[k] = scrub(val);
    }
    return out;
  };
  return scrub(value);
};

/* -----------------------------------------------------------
 * Transitions
 * --------------------------------------------------------- */

export const spring = (overrides?: Partial<Transition>): Transition =>
  maybeReduce<Transition>({
    type: "spring",
    stiffness: 180,
    damping: 22,
    mass: 0.7,
    ...overrides,
  });

export const softSpring = (overrides?: Partial<Transition>): Transition =>
  spring({ stiffness: 140, damping: 24, ...overrides });

export const swift = (overrides?: Partial<Transition>): Transition =>
  maybeReduce<Transition>({ type: "tween", ease: "easeOut", duration: 0.35, ...overrides });

/* -----------------------------------------------------------
 * Viewport helpers (SEO note: reveal-on-scroll keeps DOM content present)
 * --------------------------------------------------------- */

export const inViewOnce = { once: true, amount: 0.2 };
export const inViewSoft = { once: false, amount: 0.15 };
export const inViewTight = { once: true, amount: 0.35 };

/* -----------------------------------------------------------
 * Stagger container
 * --------------------------------------------------------- */

export const staggerContainer = (opts?: {
  delay?: number; // delay before first child
  stagger?: number;
  when?: "beforeChildren" | "afterChildren";
}): Variants =>
  maybeReduce<Variants>({
    hidden: {},
    show: {
      transition: {
        when: opts?.when ?? "beforeChildren",
        delayChildren: opts?.delay ?? 0.05,
        staggerChildren: opts?.stagger ?? 0.06,
      },
    },
  });

/* -----------------------------------------------------------
 * Common reveal variants
 * --------------------------------------------------------- */

type BaseOpts = { delay?: number; duration?: number; distance?: number };

export const fadeIn = (opts?: BaseOpts): Variants =>
  maybeReduce<Variants>({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: swift({ delay: opts?.delay, duration: opts?.duration ?? 0.35 }),
    },
  });

export const fadeInUp = (opts?: BaseOpts): Variants => {
  const d = opts?.distance ?? 16;
  return maybeReduce<Variants>({
    hidden: { opacity: 0, y: d },
    show: {
      opacity: 1,
      y: 0,
      transition: swift({ delay: opts?.delay, duration: opts?.duration ?? 0.45 }),
    },
  });
};

export const fadeInDown = (opts?: BaseOpts): Variants => {
  const d = opts?.distance ?? 16;
  return maybeReduce<Variants>({
    hidden: { opacity: 0, y: -d },
    show: {
      opacity: 1,
      y: 0,
      transition: swift({ delay: opts?.delay, duration: opts?.duration ?? 0.45 }),
    },
  });
};

export const slideIn = (direction: "left" | "right" | "up" | "down", opts?: BaseOpts): Variants => {
  const dist = opts?.distance ?? 24;
  const offset =
    direction === "left" ? -dist :
    direction === "right" ? dist :
    0;
  const offsetY =
    direction === "up" ? dist :
    direction === "down" ? -dist :
    0;

  return maybeReduce<Variants>({
    hidden: { opacity: 0, x: offset, y: offsetY },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: swift({ delay: opts?.delay, duration: opts?.duration ?? 0.5 }),
    },
  });
};

export const scaleIn = (opts?: BaseOpts & { from?: number }): Variants =>
  maybeReduce<Variants>({
    hidden: { opacity: 0, scale: opts?.from ?? 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: softSpring({ delay: opts?.delay }),
    },
  });

export const blurIn = (opts?: BaseOpts): Variants =>
  maybeReduce<Variants>({
    hidden: { opacity: 0, filter: "blur(8px)" },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: swift({ delay: opts?.delay, duration: opts?.duration ?? 0.5 }),
    },
  });

/* -----------------------------------------------------------
 * Page transitions
 * --------------------------------------------------------- */

export const pageTransition = {
  initial: "initial",
  animate: "enter",
  exit: "exit",
} as const;

export const pageFade = (opts?: { duration?: number; delay?: number }): Variants =>
  maybeReduce<Variants>({
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: swift({ duration: opts?.duration ?? 0.35, delay: opts?.delay }),
    },
    exit: {
      opacity: 0,
      transition: swift({ duration: opts?.duration ?? 0.25 }),
    },
  });

export const pageSlideUp = (opts?: { distance?: number; delay?: number }): Variants => {
  const d = opts?.distance ?? 24;
  return maybeReduce<Variants>({
    initial: { opacity: 0, y: d },
    enter: { opacity: 1, y: 0, transition: spring({ delay: opts?.delay }) },
    exit: { opacity: 0, y: d * 0.5, transition: swift({ duration: 0.25 }) },
  });
};

/* -----------------------------------------------------------
 * Utility: build a custom variant quickly
 * --------------------------------------------------------- */

export const makeVariant = (states: Partial<Record<"hidden" | "show" | "initial" | "enter" | "exit", any>>): Variants =>
  maybeReduce<Variants>(states);

/* -----------------------------------------------------------
 * Example presets specifically tuned for Ceylon Roots branding
 * --------------------------------------------------------- */

/** Gentle, premium look for hero headline */
export const heroHeadline = (): Variants =>
  maybeReduce<Variants>({
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: spring({ stiffness: 160, damping: 20 }),
    },
  });

/** Cards rising into view with slight scale for “crafted” feel */
export const cardLift = (opts?: BaseOpts): Variants =>
  maybeReduce<Variants>({
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: spring({ delay: opts?.delay }),
    },
  });

/** Understated underline grow for section titles (use with layout “overflow-hidden”) */
export const underlineGrow = (opts?: BaseOpts): Variants =>
  maybeReduce<Variants>({
    hidden: { width: 0, opacity: 0.4 },
    show: {
      width: "100%",
      opacity: 1,
      transition: swift({ delay: opts?.delay, duration: opts?.duration ?? 0.4 }),
    },
  });

/* -----------------------------------------------------------
 * Tiny convenience exports for consistency
 * --------------------------------------------------------- */

export type { Variants as MotionVariants, Transition as MotionTransition };

export default {
  prefersReducedMotion,
  maybeReduce,
  spring,
  softSpring,
  swift,
  inViewOnce,
  inViewSoft,
  inViewTight,
  staggerContainer,
  fadeIn,
  fadeInUp,
  fadeInDown,
  slideIn,
  scaleIn,
  blurIn,
  pageTransition,
  pageFade,
  pageSlideUp,
  makeVariant,
  heroHeadline,
  cardLift,
  underlineGrow,
};

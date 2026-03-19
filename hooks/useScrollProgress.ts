// /hooks/useScrollProgress.ts
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Direction = "up" | "down" | null;

type UseScrollProgressOptions = {
  /**
   * Optional scroll container. Defaults to `window` (document scrolling).
   * Pass a ref to a scrollable element created with `useRef<HTMLDivElement>(null)`.
   */
  container?: React.RefObject<HTMLElement | null>;
  /**
   * Extra top offset (px) to start progress after.
   * Useful when you have a sticky header.
   */
  offsetTop?: number;
  /**
   * Extra bottom offset (px) to end progress before reaching the absolute bottom.
   */
  offsetBottom?: number;
  /**
   * Clamp progress between 0 and 1. Default: true
   */
  clamp?: boolean;
  /**
   * Enable smoothing via requestAnimationFrame. Default: true
   */
  smooth?: boolean;
  /**
   * Throttle scroll handler (ms). 0 disables throttling. Default: 0
   */
  throttleMs?: number;
};

type ScrollProgress = {
  /** Current scrollTop (px) of the active container */
  y: number;
  /** Normalized progress from 0 to 1 (clamped if `clamp` = true) */
  progress: number;
  /** Scroll direction derived from last frame */
  direction: Direction;
  /** Approximate velocity in px/s */
  velocity: number;
  /** Total scrollable height in px (after offsets) */
  maxScroll: number;
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A robust scroll progress hook for Ceylon Roots.
 *
 * Features:
 * - Works with `window` or any scrollable element (via ref)
 * - Handles SSR safely
 * - Optional offsets (top/bottom)
 * - Direction + velocity
 * - Passive listeners, rAF smoothing, and optional throttling
 */
export function useScrollProgress(
  {
    container,
    offsetTop = 0,
    offsetBottom = 0,
    clamp = true,
    smooth = true,
    throttleMs = 0,
  }: UseScrollProgressOptions = {}
): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    y: 0,
    progress: 0,
    direction: null,
    velocity: 0,
    maxScroll: 0,
  });

  const rAF = useRef<number | null>(null);
  const lastYRef = useRef(0);
  const lastTRef = useRef<number | null>(null);
  const throttlingRef = useRef<boolean>(false);
  const queuedRef = useRef<boolean>(false);

  // Helpers to read sizes safely across window/element
  const getMetrics = () => {
    if (typeof window === "undefined") {
      return { y: 0, maxScroll: 0 };
    }

    const el = container?.current;
    if (el) {
      const y = el.scrollTop;
      const maxScrollRaw = el.scrollHeight - el.clientHeight;
      const maxScroll = Math.max(0, maxScrollRaw - offsetTop - offsetBottom);
      return { y, maxScroll };
    }

    // Window/document scrolling
    const doc = document.documentElement;
    const body = document.body;

    const y =
      window.pageYOffset ||
      doc.scrollTop ||
      body.scrollTop ||
      0;

    const scrollHeight = Math.max(
      body.scrollHeight,
      doc.scrollHeight,
      body.offsetHeight,
      doc.offsetHeight,
      body.clientHeight,
      doc.clientHeight
    );

    const viewport = window.innerHeight || doc.clientHeight;
    const maxScrollRaw = scrollHeight - viewport;
    const maxScroll = Math.max(0, maxScrollRaw - offsetTop - offsetBottom);

    return { y, maxScroll };
  };

  const compute = (now: number) => {
    const { y, maxScroll } = getMetrics();

    // Direction
    const lastY = lastYRef.current;
    let direction: Direction = null;
    if (y > lastY) direction = "down";
    else if (y < lastY) direction = "up";

    // Velocity (px/s)
    let velocity = 0;
    if (lastTRef.current !== null) {
      const dt = (now - lastTRef.current) / 1000; // seconds
      if (dt > 0) velocity = (y - lastY) / dt;
    }

    lastYRef.current = y;
    lastTRef.current = now;

    const denom = maxScroll <= 0 ? 1 : maxScroll;
    let progress = denom ? (y - offsetTop) / denom : 0;
    if (clamp) {
      progress = Math.min(1, Math.max(0, progress));
    }

    setState({
      y,
      progress,
      direction,
      velocity,
      maxScroll,
    });
  };

  const schedule = () => {
    if (!smooth) {
      // No rAF smoothing — compute immediately with Date.now()
      compute(performance.now());
      return;
    }
    if (rAF.current === null) {
      rAF.current = window.requestAnimationFrame((ts) => {
        rAF.current = null;
        compute(ts);
      });
    }
  };

  const onScroll = () => {
    if (throttleMs > 0) {
      if (!throttlingRef.current) {
        throttlingRef.current = true;
        schedule();
        window.setTimeout(() => {
          throttlingRef.current = false;
          if (queuedRef.current) {
            queuedRef.current = false;
            schedule();
          }
        }, throttleMs);
      } else {
        queuedRef.current = true;
      }
    } else {
      schedule();
    }
  };

  const onResize = () => {
    schedule();
  };

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize immediately
    const now = performance.now();
    const { y } = getMetrics();
    lastYRef.current = y;
    lastTRef.current = now;
    compute(now);

    const target: EventTarget =
      (container?.current as HTMLElement | null) ?? window;

    // Use passive listeners for perf
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    return () => {
      target.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onResize as EventListener);
      window.removeEventListener(
        "orientationchange",
        onResize as EventListener
      );
      if (rAF.current !== null) {
        cancelAnimationFrame(rAF.current);
        rAF.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container?.current, offsetTop, offsetBottom, clamp, smooth, throttleMs]);

  return state;
}

export default useScrollProgress;

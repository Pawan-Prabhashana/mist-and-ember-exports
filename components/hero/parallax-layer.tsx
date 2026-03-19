"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * ParallaxLayer
 * -----------------------------------------------------------------------------
 * Reusable motion wrapper that moves its children vertically
 * at a variable rate based on scroll position.
 *
 * Ideal for hero backgrounds, decorative elements, or layered depth effects.
 *
 * Example:
 *  <ParallaxLayer speed={-0.25}>
 *    <Image src="/images/leaves.png" alt="Leaves" fill />
 *  </ParallaxLayer>
 */

interface ParallaxLayerProps {
  /** Scroll speed multiplier (negative = move opposite scroll direction). Default: -0.2 */
  speed?: number;
  /** Vertical offset multiplier for depth simulation. Default: 1 */
  intensity?: number;
  /** Children to render inside the parallax layer */
  children: ReactNode;
  /** z-index depth */
  zIndex?: number;
  /** Optional opacity fade range (start -> end, e.g. [1, 0.4]) */
  opacityRange?: [number, number];
  /** Optional transform range override (px) */
  yRange?: [number, number];
  /** Should the layer fade in/out as it scrolls out of view? */
  fade?: boolean;
  /** Custom className for layout control */
  className?: string;
}

export default function ParallaxLayer({
  speed = -0.2,
  intensity = 1,
  children,
  zIndex = 0,
  opacityRange = [1, 1],
  yRange,
  fade = false,
  className = "",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Bind scroll progress to this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // start when enters, end when leaves viewport
  });

  // Default vertical transform range
  const defaultYRange: [number, number] = [0, speed * 100 * intensity];
  const y = useTransform(scrollYProgress, [0, 1], yRange || defaultYRange);

  // Opacity interpolation (optional fade-out)
  const opacity = fade
    ? useTransform(scrollYProgress, [0, 1], opacityRange)
    : undefined;

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        opacity,
        zIndex,
      }}
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

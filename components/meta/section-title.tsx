// /components/meta/section-title.tsx

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface SectionTitleProps {
  /** Main title of the section */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Optional alignment: left, center, or right */
  align?: "left" | "center" | "right";
  /** Optional delay for animation (seconds) */
  delay?: number;
  /** Optional additional Tailwind classes */
  className?: string;
  /** Optional highlight word or gradient effect */
  highlight?: string;
}

/**
 * Elegant and animated section title component for pages and subsections.
 * Supports alignment, subtitles, highlight word, and dark mode.
 */
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = "center",
  delay = 0,
  className,
  highlight,
}) => {
  // Split and highlight part of the title if provided
  const formattedTitle = highlight
    ? title.replace(
        highlight,
        `<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-cyan-400 font-semibold">${highlight}</span>`
      )
    : title;

  const alignment =
    align === "left"
      ? "text-left items-start"
      : align === "right"
      ? "text-right items-end"
      : "text-center items-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        `flex flex-col ${alignment} max-w-3xl mx-auto gap-2`,
        className
      )}
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white leading-tight"
        dangerouslySetInnerHTML={{ __html: formattedTitle }}
      />
      {subtitle && (
        <motion.p
          className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;

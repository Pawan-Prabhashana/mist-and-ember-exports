// /components/meta/kpi.tsx

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

interface KPIProps {
  /** KPI title (e.g. 'Monthly Revenue') */
  title: string;
  /** Main KPI value (e.g. '$45,230') */
  value: string | number;
  /** Optional subtext below value (e.g. 'vs last month') */
  subtext?: string;
  /** Optional percentage change, positive or negative (e.g. +12.3 or -5.4) */
  change?: number;
  /** Optional icon (ReactNode) */
  icon?: React.ReactNode;
  /** Tailwind className override */
  className?: string;
  /** Delay for animation in seconds */
  delay?: number;
}

/**
 * KPI component for displaying key business metrics
 * with animations, trends, and clean responsive design.
 */
const KPI: React.FC<KPIProps> = ({
  title,
  value,
  subtext,
  change,
  icon,
  className,
  delay = 0,
}) => {
  const isPositive = change !== undefined ? change >= 0 : true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "rounded-2xl bg-white dark:bg-neutral-900 p-5 shadow-sm hover:shadow-md transition-all border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {title}
        </h3>
        {icon && <div className="text-neutral-600 dark:text-neutral-300">{icon}</div>}
      </div>

      <div className="mt-3">
        <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
          {value}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between">
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center text-sm font-medium",
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {isPositive ? "+" : ""}
            {change}%
          </div>
        )}
        {subtext && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {subtext}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default KPI;

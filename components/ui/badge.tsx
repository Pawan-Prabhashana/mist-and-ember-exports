// /components/ui/badge.tsx

"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * Badge component — small label for statuses, categories, or counts.
 * 
 * Features:
 * ✅ Variants: default, secondary, outline, success, warning, destructive
 * ✅ Sizes: sm, md, lg
 * ✅ Clickable (button/link) or static span
 * ✅ Dark mode support
 * ✅ Accessible role & aria support
 */

const badgeVariants = cva(
  "inline-flex items-center font-medium rounded-full select-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
        secondary:
          "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700",
        outline:
          "border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300",
        success:
          "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300",
        warning:
          "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300",
        destructive:
          "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** If true, renders as <button> */
  asButton?: boolean;
  /** If true, renders as <a> link */
  asLink?: boolean;
  /** Optional click handler (makes badge interactive) */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Optional href for link badges */
  href?: string;
}

const Badge = React.forwardRef<HTMLElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      asButton = false,
      asLink = false,
      onClick,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const commonProps = {
      ref,
      className: cn(badgeVariants({ variant, size }), className),
      ...props,
    };

    if (asButton) {
      return (
        <button
          type="button"
          onClick={onClick}
          {...(commonProps as React.HTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    if (asLink && href) {
      return (
        <a
          href={href}
          onClick={onClick}
          {...(commonProps as React.HTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <span {...(commonProps as React.HTMLAttributes<HTMLSpanElement>)}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
export default Badge;

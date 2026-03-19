"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Speed of the marquee animation in seconds (default: 40) */
  speed?: number;
  /** Direction of scroll: "left" or "right" */
  direction?: "left" | "right";
  /** Whether to pause scrolling on hover */
  pauseOnHover?: boolean;
  /** Gap between repeated items (rem units, default: 2rem) */
  gap?: number;
}

/**
 * Reusable marquee component with smooth infinite scroll.
 * Example:
 * <Marquee speed={30} pauseOnHover className="bg-muted">
 *   <p className="mx-8 text-xl font-semibold">🚀 Venture Capital</p>
 *   <p className="mx-8 text-xl font-semibold">🌱 Growth Fund</p>
 *   <p className="mx-8 text-xl font-semibold">🌍 Sustainable Future</p>
 * </Marquee>
 */
export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  gap = 2,
  className,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  // Clone the children to make infinite effect
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Duplicate items once to create seamless loop
    const items = Array.from(scroller.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      scroller.appendChild(clone);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
      {...props}
    >
      <div
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 items-center",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          gap: `${gap}rem`,
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {React.Children.map(children, (child) => (
          <div className="flex items-center justify-center">{child}</div>
        ))}
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
};

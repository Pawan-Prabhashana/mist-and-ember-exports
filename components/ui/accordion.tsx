// /components/ui/accordion.tsx

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * A headless, accessible Accordion component set inspired by Radix/shadcn API:
 *
 * <Accordion type="single" collapsible defaultValue="item-1" onValueChange={...}>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Title</AccordionTrigger>
 *     <AccordionContent>Content</AccordionContent>
 *   </AccordionItem>
 *   ...
 * </Accordion>
 *
 * Features:
 * - Single or multiple expansion modes
 * - Optional "collapsible" for single mode (allow closing the only opened item)
 * - Controlled or uncontrolled (value / defaultValue)
 * - Smooth height animation for content
 * - Full a11y: roles, aria attributes, keyboard navigation (Up/Down/Home/End)
 * - Tailwind-friendly via className props
 */

type SingleOrMultiple<T extends "single" | "multiple"> = T extends "single"
  ? string | null
  : string[];

type AccordionBaseProps<T extends "single" | "multiple"> = {
  /** Expansion behavior */
  type?: T;
  /** Allow closing the only opened item in single mode */
  collapsible?: boolean;
  /** Controlled value(s) */
  value?: SingleOrMultiple<T>;
  /** Uncontrolled default value(s) */
  defaultValue?: SingleOrMultiple<T>;
  /** Callback when value changes */
  onValueChange?: (value: SingleOrMultiple<T>) => void;
  /** Custom className */
  className?: string;
  /** Children must be <AccordionItem/> */
  children: React.ReactNode;
  /** Disable keyboard navigation features (roving focus) */
  disableKeyboardNavigation?: boolean;
};

type AccordionContextValue = {
  type: "single" | "multiple";
  collapsible: boolean;
  valueSet: Set<string>;
  setValue: (val: string) => void;
  isOpen: (val: string) => boolean;
  registerTrigger: (btn: HTMLButtonElement | null) => () => void;
  idBase: string;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionCtx() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion compound components must be used within <Accordion>.");
  return ctx;
}

export function Accordion<T extends "single" | "multiple">({
  type = "single" as T,
  collapsible = false,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  disableKeyboardNavigation = false,
}: AccordionBaseProps<T>) {
  const idBase = React.useId();

  // Normalize incoming to Set<string>
  const normalize = React.useCallback(
    (val: SingleOrMultiple<T> | undefined): Set<string> => {
      if (type === "single") {
        const v = (val as string | null | undefined) ?? null;
        return new Set(v ? [v] : []);
      }
      const arr = (val as string[] | undefined) ?? [];
      return new Set(arr);
    },
    [type]
  );

  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<Set<string>>(
    normalize(defaultValue as SingleOrMultiple<T> | undefined)
  );
  const current = isControlled ? normalize(value as SingleOrMultiple<T>) : internal;

  const setValue = (val: string) => {
    let next = new Set(current);

    if (type === "single") {
      const alreadyOpen = next.has(val);
      if (alreadyOpen) {
        if (collapsible) {
          next.clear();
        } else {
          // keep it open (no-op)
          next = new Set([val]);
        }
      } else {
        next = new Set([val]);
      }
    } else {
      // multiple
      if (next.has(val)) next.delete(val);
      else next.add(val);
    }

    if (!isControlled) setInternal(next);

    if (onValueChange) {
      if (type === "single") {
        const out = (next.values().next().value ?? null) as SingleOrMultiple<T>;
        onValueChange(out);
      } else {
        onValueChange(Array.from(next) as SingleOrMultiple<T>);
      }
    }
  };

  const isOpen = (val: string) => current.has(val);

  // Roving focus: keep a registry of triggers for keyboard navigation
  const triggersRef = React.useRef<HTMLButtonElement[]>([]);
  const registerTrigger = (btn: HTMLButtonElement | null) => {
    if (!btn) return () => {};
    triggersRef.current.push(btn);
    // keep unique
    triggersRef.current = Array.from(new Set(triggersRef.current));
    return () => {
      triggersRef.current = triggersRef.current.filter((b) => b !== btn);
    };
  };

  // Provide keyboard navigation handlers to children via context (handled in Trigger)
  const ctxValue: AccordionContextValue = {
    type,
    collapsible,
    valueSet: current,
    setValue,
    isOpen,
    registerTrigger,
    idBase,
  };

  return (
    <AccordionContext.Provider value={ctxValue}>
      <div role="presentation" className={cn("w-full", className)} data-accordion>
        {/* roving focus support */}
        <KeyboardScope enabled={!disableKeyboardNavigation} getTriggers={() => triggersRef.current}>
          {children}
        </KeyboardScope>
      </div>
    </AccordionContext.Provider>
  );
}

/* ------------------------------ Item ------------------------------ */

type AccordionItemProps = React.PropsWithChildren<{
  /** Unique value for this item (used in state) */
  value: string;
  /** Optional className */
  className?: string;
  /** Optional disabled state */
  disabled?: boolean;
}>;

const ItemContext = React.createContext<{ value: string; disabled?: boolean } | null>(null);

export function AccordionItem({ value, className, disabled, children }: AccordionItemProps) {
  const { idBase } = useAccordionCtx();
  const itemId = `${idBase}-${value}`;

  return (
    <ItemContext.Provider value={{ value, disabled }}>
      <div
        className={cn(
          "border-b border-neutral-200 dark:border-neutral-800 last:border-b-0",
          className
        )}
        role="group"
        aria-disabled={disabled || undefined}
        data-accordion-item
        id={itemId}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
}

function useItemCtx() {
  const ctx = React.useContext(ItemContext);
  if (!ctx) throw new Error("AccordionTrigger/AccordionContent must be inside <AccordionItem>.");
  return ctx;
}

/* ---------------------------- Trigger ----------------------------- */

type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Custom class for trigger button */
  className?: string;
  /** Optional chevron placement: start | end */
  chevronPosition?: "start" | "end";
  /** Custom chevron element; defaults to ▼ rotated */
  chevronIcon?: React.ReactNode;
};

export function AccordionTrigger({
  className,
  chevronPosition = "end",
  chevronIcon,
  children,
  ...props
}: AccordionTriggerProps) {
  const { value } = useItemCtx();
  const { isOpen, setValue, registerTrigger, idBase } = useAccordionCtx();

  const open = isOpen(value);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => registerTrigger(btnRef.current), [registerTrigger]);

  const contentId = `${idBase}-${value}-content`;
  const buttonId = `${idBase}-${value}-trigger`;

  return (
    <button
      ref={btnRef}
      id={buttonId}
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={() => setValue(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-medium text-neutral-900 dark:text-white",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
        className
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {chevronPosition === "start" && (
          <Chevron open={open}>{chevronIcon}</Chevron>
        )}
        <span className="truncate">{children}</span>
      </span>
      {chevronPosition === "end" && <Chevron open={open}>{chevronIcon}</Chevron>}
    </button>
  );
}

function Chevron({
  open,
  children,
}: {
  open: boolean;
  children?: React.ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "transition-transform duration-200 inline-flex shrink-0",
        open ? "rotate-180" : "rotate-0"
      )}
    >
      {children ?? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-neutral-500 dark:text-neutral-400"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

/* ---------------------------- Content ----------------------------- */

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Animate content height open/close */
  animate?: boolean;
  /** Additional wrapper className */
  className?: string;
};

export function AccordionContent({
  children,
  className,
  animate = true,
  ...props
}: AccordionContentProps) {
  const { value } = useItemCtx();
  const { isOpen, idBase } = useAccordionCtx();

  const open = isOpen(value);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = React.useState<number | "auto">(open ? "auto" : 0);

  // Measure for height animation
  React.useLayoutEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;

    if (open) {
      // from current to auto
      const content = el.firstElementChild as HTMLElement | null;
      const next = content ? content.offsetHeight : 0;
      // Set to pixel height to enable transition, then to auto at end
      setHeight(next);
      const id = window.setTimeout(() => setHeight("auto"), 180);
      return () => window.clearTimeout(id);
    } else {
      // set to current pixel height then to 0
      const content = el.firstElementChild as HTMLElement | null;
      const current = content ? content.offsetHeight : 0;
      setHeight(current);
      const id = window.requestAnimationFrame(() => setHeight(0));
      return () => window.cancelAnimationFrame(id);
    }
  }, [open, animate]);

  const contentId = `${idBase}-${value}-content`;

  return (
    <div
      id={contentId}
      role="region"
      aria-hidden={!open}
      className={cn(
        "overflow-hidden",
        animate && "transition-all duration-200 ease-out",
        className
      )}
      style={animate ? { height: height === "auto" ? "auto" : `${height}px` } : undefined}
      {...props}
      ref={ref}
    >
      {/* inner wrapper ensures consistent height measurement */}
      <div className="pb-4 text-neutral-600 dark:text-neutral-300">
        {children}
      </div>
    </div>
  );
}

/* ----------------------- Keyboard Navigation ---------------------- */

/**
 * Handles arrow up/down and home/end to move focus across registered triggers.
 * This is opt-in via <Accordion disableKeyboardNavigation={false} />
 */
function KeyboardScope({
  children,
  enabled,
  getTriggers,
}: {
  children: React.ReactNode;
  enabled: boolean;
  getTriggers: () => HTMLButtonElement[];
}) {
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;
      const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
      if (!keys.includes(e.key)) return;

      const triggers = getTriggers().filter(Boolean);
      if (!triggers.length) return;

      const active = document.activeElement as HTMLElement | null;
      const index = triggers.findIndex((b) => b === active);
      let nextIndex = index;

      if (e.key === "ArrowDown") nextIndex = index < 0 ? 0 : Math.min(triggers.length - 1, index + 1);
      if (e.key === "ArrowUp") nextIndex = index < 0 ? 0 : Math.max(0, index - 1);
      if (e.key === "Home") nextIndex = 0;
      if (e.key === "End") nextIndex = triggers.length - 1;

      const next = triggers[nextIndex];
      if (next) {
        e.preventDefault();
        next.focus();
      }
    },
    [enabled, getTriggers]
  );

  return (
    <div onKeyDown={onKeyDown} role="presentation">
      {children}
    </div>
  );
}

/* ----------------------------- Defaults --------------------------- */

// Convenience re-exports with names similar to shadcn/radix usage
const Root = Accordion;
const Item = AccordionItem;
const Trigger = AccordionTrigger;
const Content = AccordionContent;

export default {
  Root,
  Item,
  Trigger,
  Content,
};


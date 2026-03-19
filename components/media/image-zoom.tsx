// /components/media/image-zoom.tsx
"use client";

import Image, { ImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * ImageZoom
 * -----------------------------------------------------------------------------
 * A lightweight, dependency-free zoomable image component for Next.js.
 * - Renders a brand-styled thumbnail (using <Image /> by default)
 * - On click, opens a full-screen overlay with pan + wheel-zoom
 * - Supports keyboard controls (Esc to close, +/- to zoom, arrows to nudge)
 * - Optional caption and high-resolution zoom source
 *
 * Basic usage:
 *   <ImageZoom
 *     src="/images/products/tea/tea-cta-hero.jpg"
 *     alt="Ceylon Tea"
 *     width={1200}
 *     height={800}
 *     caption="Ceylon Tea — Highlands, Sri Lanka"
 *   />
 */

type BaseProps = {
  /** Optional higher-resolution image for the zoom overlay. Defaults to `src`. */
  zoomSrc?: string;
  /** Optional caption under the zoomed image */
  caption?: string;
  /** Class for the thumbnail wrapper */
  className?: string;
  /** Disable the overlay zoom behavior */
  disabled?: boolean;
  /** Override overlay background (default: brand green with alpha) */
  overlayBg?: string;
  /** Optional: render a plain <img> instead of Next <Image> for the thumbnail */
  plainImg?: boolean;
};

type Props = BaseProps &
  (
    | (ImageProps & { plainImg?: false }) // default: Next/Image props
    | ({
        /** When plainImg=true, you must also provide width/height for layout (CSS or attributes) */
        src: string;
        alt: string;
        width?: number;
        height?: number;
        plainImg: true;
        priority?: boolean;
        sizes?: string;
      } & React.ImgHTMLAttributes<HTMLImageElement>)
  );

export default function ImageZoom(props: Props) {
  const {
    zoomSrc,
    caption,
    className,
    disabled,
    overlayBg = "rgba(8,51,53,0.9)", // #083335 at 90%
    plainImg,
    ...rest
  } = props as any;

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled]);

  // Trap scroll on body when overlay open
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Build the thumbnail element
  const thumb = useMemo(() => {
    if (plainImg) {
      const { src, alt, width, height, ...imgRest } = rest as React.ImgHTMLAttributes<HTMLImageElement> & {
        src: string;
        alt: string;
        width?: number;
        height?: number;
      };
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onClick={handleOpen}
          {...imgRest}
          className={[
            "cursor-zoom-in select-none rounded-2xl border border-[#E7E3DE] bg-white object-cover shadow-sm transition hover:shadow-md",
            imgRest.className || "",
          ].join(" ")}
          draggable={false}
        />
      );
    }

    const imageProps = rest as ImageProps;
    return (
      <Image
        {...imageProps}
        onClick={handleOpen}
        alt={imageProps.alt}
        className={[
          "cursor-zoom-in select-none rounded-2xl border border-[#E7E3DE] bg-white object-cover shadow-sm transition hover:shadow-md",
          imageProps.className || "",
        ].join(" ")}
        draggable={false}
      />
    );
  }, [plainImg, rest, handleOpen]);

  const srcForZoom = (zoomSrc || (rest as any).src) as string;

  return (
    <>
      <figure className={className}>
        {thumb}
        {(caption && !open) ? (
          <figcaption className="mt-2 text-center text-xs text-[#4B5A56]">{caption}</figcaption>
        ) : null}
      </figure>

      <AnimatePresence>
        {open && (
          <ZoomOverlay
            src={srcForZoom}
            alt={(rest as any).alt || ""}
            caption={caption}
            overlayBg={overlayBg}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ----------------------------------------------------------------------------
 * Overlay
 * --------------------------------------------------------------------------*/

function ZoomOverlay({
  src,
  alt,
  caption,
  overlayBg,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  overlayBg: string;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setDragging] = useState(false);
  const dragRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  const resetView = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(6, s + 0.2));
      if (e.key === "-" || e.key === "_") setScale((s) => Math.max(1, s - 0.2));
      if (e.key === "0") resetView();
      if (e.key === "ArrowLeft") setPos((p) => ({ ...p, x: p.x + 20 }));
      if (e.key === "ArrowRight") setPos((p) => ({ ...p, x: p.x - 20 }));
      if (e.key === "ArrowUp") setPos((p) => ({ ...p, y: p.y + 20 }));
      if (e.key === "ArrowDown") setPos((p) => ({ ...p, y: p.y - 20 }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, resetView]);

  // Wheel zoom
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    setScale((s) => {
      const next = clamp(s + (delta > 0 ? 0.15 : -0.15), 1, 6);
      return next;
    });
  }, []);

  // Drag to pan
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only left click or touch
    if (e.button !== 0 && e.pointerType !== "touch") return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.x = pos.x;
    dragRef.current.y = pos.y;
  }, [pos.x, pos.y]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({ x: dragRef.current.x + dx, y: dragRef.current.y + dy });
  }, [isDragging]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    setDragging(false);
  }, []);

  // Double click/tap to toggle zoom
  const onDoubleClick = useCallback(() => {
    setScale((s) => (s === 1 ? 2.5 : 1));
    if (scale !== 1) setPos({ x: 0, y: 0 });
  }, [scale]);

  // Close on background click (but not when clicking the image)
  const onBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) onClose();
  };

  return (
    <motion.div
      ref={containerRef}
      onClick={onBackgroundClick}
      className="fixed inset-0 z-[100] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: overlayBg }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="text-xs sm:text-sm text-[#F6F3EE]/85">
          <span className="hidden sm:inline">Click + drag to pan · Scroll to zoom · </span>
          Press Esc to close
        </div>
        <div className="flex items-center gap-2 text-[#F6F3EE]">
          <button
            className="rounded-lg border border-white/30 px-2 py-1 text-sm hover:bg-white/10"
            onClick={() => setScale((s) => Math.max(1, s - 0.2))}
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{Math.round(scale * 100)}%</span>
          <button
            className="rounded-lg border border-white/30 px-2 py-1 text-sm hover:bg-white/10"
            onClick={() => setScale((s) => Math.min(6, s + 0.2))}
          >
            +
          </button>
          <button
            className="ml-2 rounded-lg border border-white/30 px-2 py-1 text-sm hover:bg-white/10"
            onClick={resetView}
            title="Reset view"
          >
            Reset
          </button>
          <button
            className="ml-2 rounded-lg border border-white/30 px-2 py-1 text-sm hover:bg-white/10"
            onClick={onClose}
            title="Close"
          >
            Close ✕
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div className="relative flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDoubleClick={onDoubleClick}
          className="absolute left-1/2 top-1/2 max-h-none select-none"
          style={{
            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`,
            transformOrigin: "center center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
            borderRadius: 12,
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-4 sm:px-6 py-3 text-center text-sm text-[#F6F3EE]/85 border-t border-white/10 bg-black/10">
          {caption}
        </div>
      )}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Utils
 * --------------------------------------------------------------------------*/

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

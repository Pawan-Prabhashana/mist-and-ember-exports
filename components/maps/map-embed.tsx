"use client";

import { useEffect, useRef } from "react";

export type MapEmbedProps = {
  /** Google Maps or OpenStreetMap embed URL */
  src?: string;

  /** Optional title for accessibility */
  title?: string;

  /** Optional label below map (address, description, etc.) */
  label?: string;

  /** Height in pixels (default: 400) */
  height?: number;

  /** Rounded border and shadow (default: true) */
  styled?: boolean;

  /** Optional className for parent wrapper */
  className?: string;
};

/**
 * MapEmbed
 * -----------------------------------------------------------------------------
 * Responsive, accessible map iframe wrapper.
 * Default shows Google Maps view of Colombo, Sri Lanka.
 *
 * Example:
 *   <MapEmbed
 *     src="https://www.google.com/maps/embed?pb=..."
 *     label="Mist & Ember Exports HQ — Colombo, Sri Lanka"
 *   />
 */
export default function MapEmbed({
  src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31694.60947364948!2d79.84274502344014!3d6.927078800000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596a0a6f8d57%3A0x1c30781b8b6f0a1c!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1695299472000!5m2!1sen!2slk",
  title = "Mist & Ember Exports Location",
  label = "Colombo, Sri Lanka — Mist & Ember Exports Headquarters",
  height = 400,
  styled = true,
  className = "",
}: MapEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    iframeRef.current.loading = "lazy";
  }, []);

  return (
    <div
      className={[
        "w-full",
        styled
          ? "overflow-hidden rounded-2xl border border-[#E7E3DE] shadow-sm"
          : "",
        className,
      ].join(" ")}
    >
      <iframe
        ref={iframeRef}
        src={src}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full"
      />
      {label && (
        <div className="bg-[#F6F3EE] px-4 py-3 text-center text-sm text-[#083335]">
          {label}
        </div>
      )}
    </div>
  );
}

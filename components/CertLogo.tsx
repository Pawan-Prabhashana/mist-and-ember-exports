"use client";

import { useState } from "react";

export default function CertLogo({
  name,
  fileBase,
  size = 120,
}: {
  name: string;
  fileBase: string; // e.g. "/images/certifications/haccp" (no extension)
  size?: number;
}) {
  const [src, setSrc] = useState<string>(`${fileBase}.svg`);
  const [failedSvg, setFailedSvg] = useState(false);
  const [failedRaster, setFailedRaster] = useState(false);

  if (failedSvg && failedRaster) {
    return (
      <div
        aria-label={`${name} placeholder`}
        className="flex h-[120px] w-[120px] items-center justify-center rounded-md bg-[#E6E3DF] text-sm font-semibold text-[#083335]"
      >
        {name.toUpperCase()}
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={`${name} badge`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className="opacity-90"
      onError={() => {
        if (!failedSvg) {
          setFailedSvg(true);
          setSrc(`${fileBase}.png`); // try PNG fallback with same basename
        } else {
          setFailedRaster(true);
        }
      }}
    />
  );
}

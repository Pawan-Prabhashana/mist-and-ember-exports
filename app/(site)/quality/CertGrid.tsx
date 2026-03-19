"use client";

import { useState } from "react";

type Cert = { key: string; name: string; fileBase: string };

export default function CertGrid({ certs }: { certs: readonly Cert[] }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
      {certs.map((c) => (
        <div
          key={c.key}
          className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
        >
          <CertLogo name={c.name} fileBase={c.fileBase} size={120} />
          <p className="mt-3 text-sm">{c.name}</p>
        </div>
      ))}
    </div>
  );
}

function CertLogo({
  name,
  fileBase,
  size = 120,
}: {
  name: string;
  fileBase: string; // e.g. "/images/certifications/haccp" (no extension)
  size?: number;
}) {
  const [src, setSrc] = useState(`${fileBase}.svg`);
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
          setSrc(`${fileBase}.png`); // try PNG fallback
        } else {
          setFailedRaster(true);
        }
      }}
    />
  );
}

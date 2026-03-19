"use client";

import Image from "next/image";
import { useState } from "react";

// If you prefer to reuse across site, you can swap <Image> to SmartImage (below).

type Cert = {
  key: string;
  name: string;
  fileBase: string; // e.g. "/images/certifications/iso22000"
};

export default function CertGridClient({ certs }: { certs: readonly Cert[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
      {certs.map((c) => (
        <CertTile key={c.key} cert={c} />
      ))}
    </div>
  );
}

function CertTile({ cert }: { cert: Cert }) {
  const [src, setSrc] = useState<string>(`${cert.fileBase}.svg`);

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-3">
      <div className="relative h-12 w-24">
        <Image
          src={src}
          alt={cert.name}
          fill
          sizes="96px"
          className="object-contain"
          onError={() => setSrc(`${cert.fileBase}.png`)}
        />
      </div>
      <p className="text-xs text-[#E7E3DE]">{cert.name}</p>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/** PNG-only cert grid (Server Component) */
function CertGridPNG({
  certs,
}: {
  certs: ReadonlyArray<{ key: string; name: string; fileBase: string }>;
}) {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {certs.map((c) => (
        <div
          key={c.key}
          className="flex items-center gap-3 rounded-xl border border-[#E7E3DE] bg-[#FAF9F7] p-3"
        >
          <div className="relative h-12 w-24 flex-shrink-0">
            <Image
              src={`${c.fileBase}.png`} // ← PNG only
              alt={c.name}
              fill
              sizes="96px"
              className="object-contain"
            />
          </div>
          <p className="text-sm font-semibold text-[#083335]">{c.name}</p>
        </div>
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Quality & Sustainability — Mist & Ember Exports",
  description:
    "Our commitment to quality, certifications, traceability, and sustainability across Ceylon tea, cinnamon, coconut and allied exports.",
};

const KPIS: Array<{ label: string; value: string; sub?: string }> = [
  { label: "Batch Traceability", value: "100%", sub: "Farm → Factory → Export" },
  { label: "On-Time Shipments", value: "98%", sub: "Rolling 12 months" },
  { label: "Non-Conformance Rate", value: "<0.5%", sub: "Per 1,000 units" },
  { label: "Water Reuse", value: "35%", sub: "Processing facility" },
];

/** Keep fileBase WITHOUT extension; we append .png above */
const CERTS = [
  { key: "iso22000", name: "ISO 22000", fileBase: "/images/certifications/iso22000" },
  { key: "haccp", name: "HACCP", fileBase: "/images/certifications/haccp" },
  { key: "fairtrade", name: "Quality Product of Ceylon", fileBase: "/images/certifications/fairtrade" },
  { key: "organic", name: "GMP", fileBase: "/images/certifications/organic" },
] as const;

export default function QualityPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Hero — full-width with lab/quality image */}
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/factory/lab.jpg?v=2"
            alt="Quality laboratory"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#083335]/95 via-[#083335]/60 to-[#083335]/40" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24 pt-24">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#C4A36A]">
            Mist & Ember Exports
          </p>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl font-semibold text-white leading-tight">
            Quality &amp; Sustainability
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#E7E3DE]">
            We blend heritage craftsmanship with modern quality systems — from farm-level
            traceability and lab testing to internationally recognized certifications and
            responsible sourcing.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[#083335] font-semibold transition hover:opacity-90"
            >
              Request compliance pack →
            </Link>
          </div>
        </div>
      </section>

      {/* Quality System + Lab */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr]">
          {/* Quality System */}
          <article className="rounded-2xl border border-[#E7E3DE] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">
              Our Quality Management System
            </h2>
            <p className="mt-3 text-[#4B5A56]">
              We operate a documented QMS built around ISO and HACCP principles. Every lot is
              tracked end-to-end, specifications are verified against buyer requirements, and
              shipments are cleared only after QA sign-off.
            </p>

            <div className="mt-6 overflow-hidden rounded-xl border border-[#E7E3DE]">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Incoming Inspection", "Moisture, aroma, visual grading, contaminants"],
                    ["In-Process Controls", "Sieve analysis, particle size, temperature, time"],
                    ["Finished Goods QA", "Organoleptic checks, moisture, ash, labeling review"],
                    ["Compliance Docs", "COA, MSDS (where applicable), phytosanitary, origin"],
                    ["Release Criteria", "COA approved, packaging verified, seals & palletization"],
                  ].map(([k, v]) => (
                    <tr key={k} className="even:bg-[#FAF9F7]">
                      <td className="w-1/3 px-4 py-3 font-medium text-[#083335]">{k}</td>
                      <td className="px-4 py-3 text-[#4B5A56]">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* Lab & Testing */}
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-[#E7E3DE] bg-white shadow-sm">
              <div className="relative h-56 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/factory/lab.jpg?v=2"
                  alt="Quality lab"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold">Lab & Testing</h3>
                <p className="mt-2 text-sm text-[#4B5A56]">
                  Routine in-house checks and accredited third-party testing on request.
                </p>
                <ul className="mt-3 grid list-disc gap-1 pl-5 text-sm text-[#4B5A56]">
                  <li>Moisture, water activity, and ash</li>
                  <li>Microbiological (TPC, yeast &amp; mold; external)</li>
                  <li>Aflatoxin &amp; heavy metals (external, accredited)</li>
                  <li>Pesticide residues (external, accredited)</li>
                </ul>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E7E3DE] bg-white shadow-sm">
              <div className="relative h-56 w-full">
                <Image
                  src="/images/factory/processing-line.jpg"
                  alt="Processing line"
                  fill
                  sizes="(min-width: 1024px) 720px, (min-width: 768px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold">Process Controls</h3>
                <p className="mt-2 text-sm text-[#4B5A56]">
                  Documented SOPs and CCP monitoring with corrective actions and verification.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-[#083335] text-[#F6F3EE]">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">Certifications</h2>
          <p className="mt-3 max-w-3xl text-[#E7E3DE]">
            Independent assurance that our systems meet international benchmarks for food
            safety, quality, and ethical trade.
          </p>

          {/* PNG-only grid */}
          <CertGridPNG certs={CERTS} />

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-[#F6F3EE] px-5 py-3 text-[#F6F3EE] transition hover:bg-[#F6F3EE] hover:text-[#083335]"
            >
              Request compliance pack →
            </Link>
          </div>
        </div>
      </section>

      {/* Traceability & Compliance */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <article className="rounded-2xl border border-[#E7E3DE] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Traceability</h2>
            <p className="mt-3 text-[#4B5A56]">
              Each lot carries a unique batch code linked to farm origin, process history,
              and QA checkpoints. COA and shipping documentation reference these codes for
              end-to-end visibility.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Farm/Source", "Estate / Region / Supplier Code"],
                ["Processing", "Date, line, CCP logs"],
                ["Quality", "COA, specs, sample retention"],
                ["Shipment", "Packing list, seal, BL/AWB"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-[#E7E3DE] bg-[#FAF9F7] p-4">
                  <p className="text-sm font-semibold text-[#083335]">{k}</p>
                  <p className="mt-1 text-sm text-[#4B5A56]">{v}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[#E7E3DE] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Regulatory Compliance</h2>
            <p className="mt-3 text-[#4B5A56]">
              We align exports with destination market requirements (EU, UK, US, Middle East,
              APAC) including labeling, contaminants, and phytosanitary controls. Third-party
              tests are provided upon request.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm text-[#4B5A56] space-y-1">
              <li>Phytosanitary and certificate of origin</li>
              <li>Allergen &amp; GMO declarations where applicable</li>
              <li>Lot retention samples and stability (where relevant)</li>
              <li>Private label compliance support (artwork checks)</li>
            </ul>
          </article>
        </div>
      </section>

      {/* Sustainability KPIs */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">
            Sustainability Metrics
          </h2>
          <p className="mt-3 max-w-3xl text-[#4B5A56]">
            Responsible sourcing and efficient processing reduce our footprint and support
            farming communities.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-2xl border border-[#E7E3DE] bg-[#FAF9F7] p-6 text-center"
              >
                <p className="text-3xl md:text-4xl font-serif font-semibold">{kpi.value}</p>
                <p className="mt-1 text-sm font-medium">{kpi.label}</p>
                {kpi.sub && <p className="mt-1 text-xs text-[#4B5A56]">{kpi.sub}</p>}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-5 py-3 text-[#083335] transition hover:bg-[#083335] hover:text-white"
            >
              Read our latest impact stories
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#083335] px-5 py-3 text-white transition hover:opacity-95"
            >
              Partner with us →
            </Link>
          </div>
        </div>
      </section>

      {/* Download Center */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">Download Center</h2>
          <p className="mt-3 text-[#4B5A56]">
            Request full documents via our contact form if you need a dedicated compliance pack.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-[#E7E3DE]">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF9F7]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Document</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Quality Overview", "PDF (summary)", "/og/og-quality.jpg"],
                  ["Sample COA (Redacted)", "PDF (example)", "/og/og-quality.jpg"],
                  ["HACCP Plan Summary", "PDF (summary)", "/og/og-quality.jpg"],
                ].map(([name, type, href]) => (
                  <tr key={name} className="border-t border-[#E7E3DE]">
                    <td className="px-4 py-3">{name}</td>
                    <td className="px-4 py-3 text-[#4B5A56]">{type}</td>
                    <td className="px-4 py-3">
                      <a
                        href={String(href)}
                        className="rounded-xl border border-[#083335] px-3 py-2 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Preview
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-[#4B5A56]">
            Need a custom certificate set (destination-specific)?{" "}
            <Link href="/contact" className="underline decoration-[#C4A36A]/70 underline-offset-2">
              Contact our QA team
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
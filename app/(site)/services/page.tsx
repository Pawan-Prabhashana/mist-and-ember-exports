import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Export & Logistics Services — Mist & Ember Exports",
  description:
    "From sourcing and processing to quality control, documentation, and global logistics — premium export services for Ceylon tea, cinnamon, coconut and more.",
};

const SERVICES: Array<{
  key: string;
  title: string;
  icon: string; // /public/icons/*
  desc: string;
}> = [
  {
    key: "sourcing",
    title: "Ethical Sourcing",
    icon: "/icons/leaf.png", // ← was .png, switched to .svg
    desc:
      "Direct relationships with growers and curated estates across Sri Lanka, ensuring traceable and responsible supply.",
  },
  {
    key: "processing",
    title: "Processing & Blends",
    icon: "/icons/flask.png",
    desc:
      "Grading, cleaning, blending, and private-label development aligned to buyer specs and target markets.",
  },
  {
    key: "quality",
    title: "Quality Assurance",
    icon: "/icons/certificate.png",
    desc:
      "ISO/HACCP-aligned checks, COA, and third-party accredited tests on request for global market compliance.",
  },
  {
    key: "logistics",
    title: "Global Logistics",
    icon: "/icons/logistics.png",
    desc:
      "Export documentation, multi-modal shipping, and route optimization with reliable freight partners.",
  },
];

const CAPABILITIES: string[] = [
  "Private label & custom packaging",
  "Custom blends and flavor profiles",
  "Bulk & retail pack formats",
  "Destination-specific compliance checks",
  "Third-party lab testing on request",
  "Flexible Incoterms (EXW, FOB, CIF, DDP where applicable)",
];

const SLA_ROWS: Array<[string, string, string]> = [
  ["Tea (Orthodox)", "7–14 days", "Up to 150 MT / month"],
  ["Cinnamon (Quills/Powder)", "10–20 days", "Up to 80 MT / month"],
  ["Coconut (Desiccated/Oil/Milk)", "10–18 days", "Up to 120 MT / month"],
  ["Other Spices/Herbs", "10–21 days", "On request"],
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Hero — solid green background */}
      <section className="relative min-h-[55vh] flex flex-col justify-end overflow-hidden bg-[#083335]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#052a2c] via-[#083335] to-[#0a3d40]" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #C4A36A 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        <div className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24 pt-24">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#C4A36A]">
            Mist & Ember Exports
          </p>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl font-semibold text-white leading-tight">
            Export &amp; Logistics Services
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#E7E3DE]">
            End-to-end solutions from farm to freight — ethical sourcing, precision processing,
            rigorous quality control, and on-time global delivery.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[#083335] font-semibold transition hover:opacity-90"
            >
              Talk to our exports team →
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3 text-white font-semibold transition hover:bg-white hover:text-[#083335]"
            >
              Explore products
            </Link>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <article
              key={s.key}
              className="group rounded-2xl border border-[#E7E3DE] bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.icon}
                alt={s.title}
                className="h-8 w-8 opacity-90"
                width={32}
                height={32}
              />
              <h2 className="mt-4 font-serif text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5A56]">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Process flow */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">How We Work</h2>
          <p className="mt-3 max-w-3xl text-[#4B5A56]">
            A clear, documented workflow ensures consistent quality and predictable timelines.
          </p>

          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Sourcing", "Supplier vetting, farm visits, MOUs"],
              ["Processing", "Grading, blending, packing"],
              ["Quality", "COA, labeling, documentation"],
              ["Logistics", "Booking, customs, dispatch"],
            ].map(([title, body], idx) => (
              <li
                key={title}
                className="relative rounded-2xl border border-[#E7E3DE] bg-[#FAF9F7] p-6"
              >
                <div className="absolute right-4 top-4 text-sm font-semibold text-[#9AA6A2]">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="font-serif text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-[#4B5A56]">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border border-[#E7E3DE] bg-white p-6">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h3 className="font-serif text-xl font-semibold">Documentation Suite</h3>
                <ul className="mt-3 list-disc pl-5 text-sm text-[#4B5A56] space-y-1">
                  <li>Commercial invoice, packing list, certificate of origin</li>
                  <li>Phytosanitary certificates and health declarations</li>
                  <li>COA, MSDS (where applicable), allergen/GMO statements</li>
                  <li>Private-label artwork checks and labeling compliance</li>
                </ul>
                <div className="mt-4">
                  <Link
                    href="/quality"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-4 py-2 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                  >
                    Learn about our QA →
                  </Link>
                </div>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/factory/processing-line.jpg"
                  alt="Export process"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">Capabilities</h2>
          <p className="mt-3 max-w-3xl text-[#4B5A56]">
            Modular services to fit your procurement strategy and market requirements.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 rounded-xl border border-[#E7E3DE] bg-white p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/arrow-right.png"
                  alt=""
                  className="mt-1 h-4 w-4"
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
                <span className="text-sm text-[#4B5A56]">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SLAs & Lead Times */}
      <section className="bg-[#083335] text-[#F6F3EE]">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">
            SLAs &amp; Lead Times
          </h2>
          <p className="mt-3 max-w-3xl text-[#E7E3DE]">
            Typical production windows and monthly capacity (subject to seasonality and grade).
          </p>

          <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-white/15">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Production Window</th>
                  <th className="px-4 py-3 text-left font-semibold">Monthly Capacity</th>
                </tr>
              </thead>
              <tbody>
                {SLA_ROWS.map(([cat, win, cap], i) => (
                  <tr key={cat} className={i % 2 ? "bg-white/5" : ""}>
                    <td className="px-4 py-3">{cat}</td>
                    <td className="px-4 py-3">{win}</td>
                    <td className="px-4 py-3">{cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F6F3EE] px-5 py-3 text-[#083335] transition hover:opacity-90"
            >
              Request a production slot →
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-[#F6F3EE] px-5 py-3 text-[#F6F3EE] transition hover:bg-[#F6F3EE] hover:text-[#083335]"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">FAQs</h2>
          <div className="mt-6 grid gap-4">
            {[
              [
                "Which Incoterms do you support?",
                "We commonly work with EXW, FOB, and CIF. DDP is possible for select destinations; contact us to confirm feasibility.",
              ],
              [
                "Can you support private label packaging?",
                "Yes. We offer dielines, artwork checks for compliance, and a range of retail formats alongside bulk.",
              ],
              [
                "Do you arrange third-party tests?",
                "Yes. We coordinate accredited labs for pesticide residues, heavy metals, and microbiology based on destination requirements.",
              ],
              [
                "How do you ensure traceability?",
                "Each lot is linked to farm/estate, process logs, and QA checkpoints with COA and shipment references.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group overflow-hidden rounded-2xl border border-[#E7E3DE] bg-white p-5"
              >
                <summary className="cursor-pointer list-none font-medium">
                  {q}
                </summary>
                <p className="mt-2 text-sm text-[#4B5A56]">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-5 py-3 text-[#083335] transition hover:bg-[#083335] hover:text-white"
            >
              Ask a question →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

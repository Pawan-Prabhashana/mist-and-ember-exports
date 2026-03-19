import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ceylon Tea — Mist & Ember Exports",
  description:
    "Discover the story of Ceylon tea — from James Taylor's first plantation to the finest hand-plucked leaves from Sri Lanka's highlands. Pure Ceylon tea, packed in Sri Lanka.",
};

const REGIONS = [
  {
    name: "Kandy",
    desc: "Grown in the ancient cultural capital, mid-country Kandy teas offer a unique, full-bodied flavour. Dark golden liquor with strong character, grown at 2,000–4,000 ft. A relaxing all-day beverage.",
  },
  {
    name: "Nuwara Eliya",
    desc: "The Champagne of Ceylon tea. Grown 6,000 ft above sea level, these teas have an exquisite light taste and gentle aroma. The palest infusion with a delicate, fragrant flavour.",
  },
  {
    name: "Dimbula",
    desc: "Over a century of heritage. Grown at 3,500–5,000 ft, Dimbula produces a full-bodied brew with distinct flavours synonymous with this celebrated region.",
  },
  {
    name: "Uva",
    desc: "From the Eastern Highlands, grown at 3,000–5,000 ft. Renowned worldwide for its smooth taste. Best enjoyed during the Uva season (July–August) for the finest seasonal teas.",
  },
  {
    name: "Ruhuna",
    desc: "Southern Sri Lanka, from sea level to 2,000 ft. A rich, robust brew with attractive dark appearance and versatile strength — the essence of coastal tea gardens.",
  },
];

export default function CeylonTeaPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Hero — solid green background */}
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden bg-[#083335]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#052a2c] via-[#083335] to-[#0a3d40]" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #C4A36A 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        <div className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24 pt-24">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#C4A36A]">
            Mist & Ember Exports
          </p>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl font-semibold text-white leading-tight">
            The Story of Ceylon Tea
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#E7E3DE]">
            For centuries, Ceylon tea has been known as the finest tea in the world. Hand-plucked from
            the best estates across Sri Lanka — where heritage meets excellence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products?category=tea"
              className="rounded-full bg-white px-8 py-4 text-[#083335] font-semibold transition hover:opacity-90"
            >
              Explore Ceylon Tea →
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-white px-8 py-4 text-white font-semibold transition hover:bg-white hover:text-[#083335]"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Intro — rich content block with heritage engraving */}
      <section className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #083335 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative z-10 mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="mx-auto md:mx-0 h-px w-20 bg-[#C4A36A]/60 mb-8" />
            <p className="text-lg md:text-xl text-[#4B5A56] leading-relaxed">
            Tea was first introduced to Sri Lanka by James Taylor in 1867 at Loolecondera Estate in
            Kandy. What began with coffee soon gave way to tea — and the rest, as they say, is history.
            Although Sri Lanka is a comparatively small country, its range in elevation creates
            remarkably varied flavours depending on region: climate, soil, sun, and rainfall shape
            each cup. Ceylon tea is classically known for bold, full, and brisk flavour — and the
            majority is still hand-picked, ensuring brightness and character.
          </p>
          </div>
          <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-2xl border border-[#E7E3DE] shadow-lg">
            <Image
              src="/images/ceylon-heritage-engraving.png"
              alt="Historical Ceylon — colonial-era tea heritage"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Types of Ceylon Tea */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-4">
            The Three Types of Ceylon Tea
          </h2>
          <div className="mx-auto h-px w-16 bg-[#C4A36A]/60 mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[#E7E3DE] bg-[#FAF9F7] p-8 shadow-sm">
              <div className="h-1 w-12 bg-[#083335] rounded-full mb-4" />
              <h3 className="font-serif text-xl font-semibold text-[#083335]">Black Ceylon Tea</h3>
              <p className="mt-3 text-[#4B5A56] text-sm leading-relaxed">
                The most popular and complex. Made using aged stems and fermented leaves from the
                Camellia sinensis plant. Produces a robust, full-bodied cup with rich colour.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E7E3DE] bg-[#FAF9F7] p-8 shadow-sm">
              <div className="h-1 w-12 bg-[#2e6748] rounded-full mb-4" />
              <h3 className="font-serif text-xl font-semibold text-[#083335]">Ceylon Green Tea</h3>
              <p className="mt-3 text-[#4B5A56] text-sm leading-relaxed">
                Skips fermentation — leaves are pan-fried or steamed after rolling. The leaf stays
                green, yielding a yellowish-green liquor with a delicate, fresh character.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E7E3DE] bg-[#FAF9F7] p-8 shadow-sm">
              <div className="h-1 w-12 bg-[#C4A36A] rounded-full mb-4" />
              <h3 className="font-serif text-xl font-semibold text-[#083335]">Ceylon White Tea</h3>
              <p className="mt-3 text-[#4B5A56] text-sm leading-relaxed">
                Also known as Silver Tips. Only the bud is hand-picked and sun-dried. The least
                processed tea — prized for its delicate flavour and health benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lion Logo — Symbol of Quality */}
      <section className="bg-[#083335] text-[#F6F3EE] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 md:px-12 lg:px-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#C4A36A]">
            The Lion Logo — Symbol of Quality
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-[#C4A36A]/60 mb-8" />
          <p className="text-[#E7E3DE] leading-relaxed">
            The Ceylon Tea Symbol of Quality — the Lion Logo — is a stamp of approval from the Sri Lanka
            Tea Board. It certifies that tea meets the highest standards: 100% Pure Ceylon Tea,
            packed in Sri Lanka. Every pack of Mist & Ember tea carrying the Lion Logo guarantees
            traceability, quality testing, and compliance with strict legal and sensory standards.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <div className="rounded-xl bg-white/10 px-6 py-4 text-center">
              <p className="font-semibold text-white">100%</p>
              <p className="text-sm text-[#E7E3DE]">Pure Ceylon Tea</p>
            </div>
            <div className="rounded-xl bg-white/10 px-6 py-4 text-center">
              <p className="font-semibold text-white">Packed in Sri Lanka</p>
              <p className="text-sm text-[#E7E3DE]">Origin assured</p>
            </div>
            <div className="rounded-xl bg-white/10 px-6 py-4 text-center">
              <p className="font-semibold text-white">Board Certified</p>
              <p className="text-sm text-[#E7E3DE]">Quality tested</p>
            </div>
          </div>
        </div>
      </section>

      {/* Five Regions — centered grid so last row is centered */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-4">
            The Five Regions of Ceylon Tea
          </h2>
          <div className="mx-auto h-px w-16 bg-[#C4A36A]/60 mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {REGIONS.map((r) => (
              <div
                key={r.name}
                className="w-full max-w-sm rounded-2xl border border-[#E7E3DE] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-serif text-xl font-semibold text-[#083335]">{r.name}</h3>
                <p className="mt-2 text-sm text-[#4B5A56] leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#083335] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xl text-[#E7E3DE] mb-6">
            Ready to experience the finest Ceylon tea?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#F6F3EE] px-8 py-4 text-[#083335] font-semibold transition hover:opacity-90"
          >
            Get in Touch →
          </Link>
        </div>
      </section>
    </main>
  );
}

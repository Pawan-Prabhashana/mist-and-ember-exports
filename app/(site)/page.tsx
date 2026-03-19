/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BackgroundVideo from "@/components/BackgroundVideo";
import HeroContent from "@/components/home/hero-content";
import ScrollReveal from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Mist & Ember Exports — Rooted in Ceylon. Grown for the World.",
  description:
    "Authentic Ceylon tea, cinnamon, coconut and other natural exports — connecting Sri Lankan heritage with modern global trade.",
  openGraph: {
    title: "Mist & Ember Exports — Rooted in Ceylon. Grown for the World.",
    description:
      "Premium Sri Lankan exports: Ceylon tea, cinnamon, coconut & more — responsibly sourced, expertly processed, globally delivered.",
    images: ["/og/og-home.jpg"], // must exist in /public/og/og-home.jpg
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#F6F3EE] text-[#083335]">
      {/* ─────────────── Hero ─────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center overflow-hidden h-[90vh] md:h-[100vh]">
        {/* Background video (uses BackgroundVideo for reliable autoplay + fallback) */}
        <BackgroundVideo />

        {/* Dark overlay (won’t block clicks) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#083335]/70 via-[#083335]/50 to-[#083335]/60 pointer-events-none" />

        <HeroContent />
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A36A]/40 to-transparent" />

      {/* ─────────────── Brand Promise / Highlights ─────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #083335 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wide text-[#083335]">
              Purity • Craft • Reliability
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-[#C4A36A]/60" />
            <p className="mt-4 text-[#4B5A56] max-w-2xl mx-auto">
            For over a decade, Mist & Ember Exports has connected Sri Lanka’s finest producers with
            global buyers — guided by uncompromising quality, transparency, and sustainable
            trade.
          </p>
          </ScrollReveal>
          <div className="mt-8 py-6 border-y border-[#E7E3DE]/60 flex flex-wrap justify-center gap-8 md:gap-12 text-sm text-[#4B5A56]">
            <span className="font-medium text-[#083335]">20+</span>
            <span>Countries served</span>
            <span className="text-[#C4A36A]">•</span>
            <span className="font-medium text-[#083335]">3+</span>
            <span>Years of excellence</span>
            <span className="text-[#C4A36A]">•</span>
            <span className="font-medium text-[#083335]">100%</span>
            <span>Traceability</span>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: "/icons/leaf.png", title: "Pure Origins", text: "Ethically sourced from trusted estates and growers across Sri Lanka." },
              { icon: "/icons/certificate.png", title: "Assured Quality", text: "ISO / HACCP certified with full traceability and lab-tested purity." },
              { icon: "/icons/globe.png", title: "Global Reach", text: "Exports to 20+ countries across Asia, Europe, and the Middle East." },
            ].map(({ icon, title, text }, i) => (
              <ScrollReveal key={title} delay={i * 0.1}>
                <div className="flex flex-col h-full min-h-[220px] rounded-2xl bg-[#FAF9F7] p-8 text-center shadow-[0_8px_30px_rgba(8,51,53,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(8,51,53,0.12)]">
                <Image
                  src={icon}
                  alt=""
                  width={40}
                  height={40}
                  className="mx-auto flex-shrink-0 opacity-90"
                />
                <h3 className="mt-4 font-serif text-xl font-semibold text-[#083335]">{title}</h3>
                <p className="mt-2 text-[#4B5A56] flex-1">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A36A]/30 to-transparent" />

      {/* ─────────────── Signature Products ─────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-[#F6F3EE] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%23083335' stroke-width='0.5' fill='none'/%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wide text-[#083335]">Our Signature Exports</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-[#C4A36A]/60" />
            <p className="mt-4 text-[#4B5A56] max-w-2xl mx-auto">
              Discover the essence of Ceylon — naturally rich, globally trusted.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Ceylon Tea", img: "/images/products/tea/tea-cta-hero.jpg", href: "/ceylon-tea" },
              { name: "Ceylon Cinnamon", img: "/images/products/cinnamon/cinnamon-quills.jpg", href: "/products?category=cinnamon" },
              { name: "Coconut Products", img: "/images/products/coconut/coconut-virgin-oil.jpg", href: "/products?category=coconut" },
            ].map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 0.1}>
                <Link
                  href={p.href}
                  className="group relative block overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(8,51,53,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(8,51,53,0.12)]"
                >
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={600}
                    height={400}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#083335]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <h3 className="text-xl font-serif font-semibold text-white">{p.name}</h3>
                    <p className="text-sm text-[#E7E3DE] transition-transform group-hover:translate-x-1">Learn more →</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A36A]/40 to-transparent" />

      {/* ─────────────── About / Story Preview ─────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #083335 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <ScrollReveal>
            <div className="relative h-80 md:h-[480px] w-full overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(8,51,53,0.08)]">
            <Image
              src="/images/factory/facility-exterior.jpg"
              alt="Galpadithanne tea factory (KDU)"
              fill
              className="object-cover"
              priority
            />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wide text-[#083335]">
              Rooted in Heritage, Driven by Innovation
            </h2>
            <p className="mt-4 text-[#4B5A56] leading-relaxed">
              What began as a small family-run operation has evolved into a globally recognized
              export house — built on Sri Lanka’s agricultural legacy and modern, sustainable
              processing technology.
            </p>
            <div className="mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#083335] px-5 py-3 text-[#083335] font-medium transition-all duration-300 hover:bg-[#083335] hover:text-white"
              >
                Our Story →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A36A]/50 to-transparent" />

      {/* ─────────────── Quality Teaser ─────────────── */}
      <section className="relative bg-[#083335] text-[#F6F3EE] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #C4A36A 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20 grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wide">
              Certified Quality & Sustainability
            </h2>
            <p className="mt-4 text-[#E7E3DE] leading-relaxed">
              ISO 22000 · HACCP · Fairtrade · Organic — every shipment is backed by
              international standards and traceability from source to container.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {["iso22000", "haccp", "fairtrade", "organic"].map((c) => (
                <Image
                  key={c}
                  src={`/images/certifications/${c}.png`}
                  alt={c}
                  width={80}
                  height={32}
                  className="h-10 w-auto opacity-90"
                />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/quality"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F6F3EE] px-5 py-3 text-[#083335] font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg"
              >
                View Quality Standards →
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="relative h-80 md:h-[420px] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image src="/images/factory/lab.jpg" alt="Quality laboratory" fill className="object-cover" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A36A]/40 to-transparent" />

      {/* ─────────────── Global Reach ─────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #083335 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wide text-[#083335]">Global Reach</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-[#C4A36A]/60" />
            <p className="mt-4 text-[#4B5A56] max-w-2xl mx-auto">
              We proudly export Sri Lankan excellence to 20+ countries — connecting Asia, Europe, and the Middle East through sustainable trade partnerships.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="mt-10 flex justify-center">
              <Image
                src="/images/global/map.png"
                alt="Global export destinations"
                width={1200}
                height={600}
                className="rounded-2xl object-cover shadow-[0_8px_30px_rgba(8,51,53,0.08)] max-h-[400px]"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="rounded-xl bg-[#083335] px-6 py-3 text-white font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg">
                Become a Partner →
              </Link>
              <Link href="/services" className="rounded-xl border-2 border-[#083335] px-6 py-3 text-[#083335] font-medium transition-all duration-300 hover:bg-[#083335] hover:text-white">
                Learn About Our Process
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pre-footer CTA strip */}
      <section className="bg-[#F6F3EE] border-t border-[#E7E3DE]/50 py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-[#4B5A56] text-lg mb-4">
            Ready to bring Ceylon to your table?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[#083335] px-8 py-4 text-white font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg"
          >
            Get in Touch →
          </Link>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";

/** Tries base.jpg → base.png → fallback. Use cacheBust to force reload after image updates. */
function SmartImg({
  base, // e.g. "/images/team/cofounder-1" (no extension)
  alt,
  fallback,
  className,
  width,
  height,
  cacheBust,
}: {
  base: string;
  alt: string;
  fallback: string;
  className?: string;
  width?: number;
  height?: number;
  cacheBust?: string;
}) {
  const suffix = cacheBust ? `?v=${cacheBust}` : "";
  const [src, setSrc] = useState<string>(`${base}.jpg${suffix}`);
  const [triedPng, setTriedPng] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (!triedPng) {
          setTriedPng(true);
          setSrc(`${base}.png${suffix}`);
        } else {
          setSrc(fallback);
        }
      }}
      decoding="async"
    />
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 overflow-hidden">
        {/* Background with real + fallback */}
        <div
          className="absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage:
              "url('/images/textures/texture-tea-normal.jpg'), url('/images/placeholders/texture-tea-fallback.png')",
            backgroundSize: "cover, cover",
            backgroundPosition: "center, center",
          }}
        />

        <div className="relative z-10 px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-4">
            Our Story
          </h1>
          <div className="mx-auto mt-4 h-px w-20 bg-[#C4A36A]/70" />
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#4B5A56]">
            From the lush hills of Sri Lanka to the world — Mist & Ember Exports was founded to share
            the purest essence of our island’s nature through authentic Ceylon tea, cinnamon,
            coconut, and other treasures.
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A36A]/40 to-transparent" />

      {/* Heritage Section */}
      <section className="px-6 md:px-16 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/factory/facility-exterior.jpg?v=2"
            alt="Galpadithanne tea factory (KDU)"
            width={800}
            height={600}
            className="rounded-2xl shadow-lg w-full h-auto object-cover"
          />
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">Rooted in Heritage</h2>
          <p className="text-[#4B5A56] leading-relaxed mb-4">
            Our journey began decades ago in the misty tea highlands of Ceylon…
          </p>
          <p className="text-[#4B5A56] leading-relaxed">
            Every product we craft is a story of sustainability, craftsmanship, and passion —
            from the soil to your table.
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A36A]/40 to-transparent" />

      {/* Timeline Section */}
      <section className="bg-[#083335] text-[#F6F3EE] py-24 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          {/* Move heading slightly right so it aligns with the timeline column */}
          <h2 className="text-4xl font-serif font-semibold mb-12 text-white md:ml-8 text-center md:text-left">
            Our Journey
          </h2>

          <div className="space-y-8 border-l border-[#C4A36A] pl-8 relative md:text-left text-center">
            {[
              {
                year: "2023",
                title: "Our Roots Begin",
                text:
                  "A small business starts sourcing and drying Ceylon tea leaves by hand.",
              },
              {
                year: "2024",
                title: "Expanding Horizons",
                text:
                  "We entered the global market, introducing premium Ceylon spices and coconut products.",
              },
              {
                year: "2025",
                title: "Modernization & Sustainability",
                text:
                  "Invested in eco-friendly facilities, digital traceability, and fair trade partnerships.",
              },
            ].map((item, idx) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-4 top-1 w-3 h-3 bg-[#C4A36A] rounded-full" />
                <h3 className="text-2xl font-serif mb-1 text-white">{item.year}</h3>
                <h4 className="text-lg font-semibold text-[#C4A36A] mb-1">
                  {item.title}
                </h4>
                <p className="text-[#E7E3DE] max-w-xl md:mx-0 mx-auto">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A36A]/50 to-transparent" />

      {/* Vision & Team Section */}
      <section className="px-6 md:px-16 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
              Our Vision
            </h2>
            <p className="text-[#4B5A56] leading-relaxed mb-4">
              To be the trusted global ambassador of authentic Sri Lankan products…
            </p>
            <p className="text-[#4B5A56] leading-relaxed">
              Every shipment reflects our commitment to quality, integrity, and the timeless values rooted in Ceylon’s soil.
            </p>
          </div>

          {/* Founders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { key: "cofounder-1", name: "Pawan Prabhashana", role: "Co-Founder" },
              { key: "cofounder-2", name: "Sithum Mihisara", role: "Co-Founder" },
            ].map((m) => (
              <div key={m.key} className="bg-white rounded-2xl shadow-md overflow-hidden group">
                <div className="aspect-[3/4] min-h-[320px] overflow-hidden">
                  <SmartImg
                    base={`/images/team/${m.key}`}
                    alt={m.name}
                    fallback="/images/placeholders/portrait-3x4.png"
                    cacheBust="2"
                    width={400}
                    height={533}
                    className="object-cover object-top w-full h-full min-h-[320px] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="font-semibold text-lg text-[#083335]">{m.name}</p>
                  <p className="text-[#4B5A56]">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="bg-[#083335] text-[#F6F3EE] py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6 text-[#C4A36A]">
            A Message from Our Founders
          </h2>
          <p className="text-lg md:text-xl text-[#E7E3DE] leading-relaxed">
            We started Mist & Ember Exports with a simple belief: that the world deserves to experience
            the authentic taste of Ceylon — unspoiled, ethically sourced, and crafted with care. Every
            cup of tea, every stick of cinnamon, and every coconut product we export carries the soul
            of Sri Lanka. Thank you for being part of our journey.
          </p>
        </div>
      </section>
    </main>
  );
}

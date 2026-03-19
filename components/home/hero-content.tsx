"use client";

import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-4xl md:text-6xl font-semibold text-[#F6F3EE] tracking-wide">
        Rooted in Ceylon. <br className="hidden md:block" /> Grown for the World.
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-[#E7E3DE] text-base md:text-lg">
        Discover the soul of Sri Lanka through the finest Ceylon tea, cinnamon,
        coconut, and other authentic exports — where heritage meets innovation.
      </p>
      <div className="mx-auto mt-6 h-px w-16 bg-[#C4A36A]" />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-[#F6F3EE] px-6 py-3 text-[#083335] text-sm font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg"
        >
          Explore Products
        </Link>
        <Link
          href="/about"
          className="rounded-xl border-2 border-[#F6F3EE] px-6 py-3 text-[#F6F3EE] text-sm font-medium transition-all duration-300 hover:bg-[#F6F3EE] hover:text-[#083335]"
        >
          About Us
        </Link>
      </div>
    </div>
  );
}

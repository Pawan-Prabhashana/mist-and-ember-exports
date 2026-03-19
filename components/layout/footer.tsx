// /components/layout/footer.tsx
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E7E3DE] bg-[#083335] text-[#F6F3EE]">
      <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/brand/ceylon-roots-logomark.svg"
              alt="Mist & Ember Exports"
              width={48}
              height={48}
              className="opacity-90"
              priority={false}
            />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Mist & Ember Exports
            </span>
          </Link>
          <p className="mt-4 text-sm text-[#E7E3DE] max-w-xs">
            Rooted in Sri Lanka. Grown for the world. Authentic exports of Ceylon tea,
            cinnamon, coconut, and more — responsibly sourced and globally delivered.
          </p>

          {/* Socials (optional; add real links) */}
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full p-2 hover:bg-white/10 transition"
            >
              <Instagram className="h-5 w-5 opacity-90" />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-full p-2 hover:bg-white/10 transition"
            >
              <Linkedin className="h-5 w-5 opacity-90" />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full p-2 hover:bg-white/10 transition"
            >
              <Facebook className="h-5 w-5 opacity-90" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-[#E7E3DE]">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:underline">
                Our Products
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link href="/quality" className="hover:underline">
                Quality & Sustainability
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:underline">
                News & Stories
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm text-[#E7E3DE]">
            <li>
              <Link href="/legal/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:underline">
                Terms of Use
              </Link>
            </li>
            <li>
              <a
                href="/sitemap.xml"
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Sitemap
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-1 text-sm text-[#E7E3DE]">
            <li>Colombo, Sri Lanka</li>
            <li>
              <a href="mailto:hello@mistandemberexports.com" className="underline hover:no-underline">
                hello@mistandemberexports.com
              </a>
            </li>
            <li>
              <a href="tel:+94718159949" className="underline hover:no-underline">
                +94 71 815 9949
              </a>
            </li>
            <li>
              <a href="tel:+94703203060" className="underline hover:no-underline">
                +94 70 320 3060
              </a>
            </li>
          </ul>

          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F6F3EE] px-5 py-3 text-[#083335] text-sm font-medium transition hover:opacity-90"
            >
              Get in Touch →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-[#E7E3DE]/20 bg-[#072E2E] py-4">
        <div className="mx-auto max-w-6xl px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E7E3DE] gap-2">
          <p>© {year} Mist & Ember Exports. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Built with ❤️ in Sri Lanka ·{" "}
            <Link
              href="https://www.mistandemberexports.com"
              className="underline decoration-[#C4A36A]/70 underline-offset-2"
              target="_blank"
            >
              www.mistandemberexports.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

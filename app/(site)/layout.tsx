import Image from "next/image";
import Link from "next/link";
import MobileMenu from "@/components/layout/mobile-menu";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] w-full">{children}</main>
      <Footer />
    </>
  );
}

// ─────────────────────────────────────────────
// 3. Header Component
// ─────────────────────────────────────────────
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#F6F3EE]/90 backdrop-blur border-b border-[#E7E3DE]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/ceylon-roots-logo.png"
            alt="Mist & Ember Exports logo"
            width={48}
            height={48}
            priority
          />
          <span className="font-serif text-xl md:text-2xl font-semibold tracking-tight">
            Mist & Ember Exports
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-base font-medium text-[#083335]">
          <Link href="/about" className="relative py-1 transition hover:text-[#B07C4F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C4A36A] after:transition-all after:duration-300 hover:after:w-full">
            About
          </Link>
          <Link href="/products" className="relative py-1 transition hover:text-[#B07C4F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C4A36A] after:transition-all after:duration-300 hover:after:w-full">
            Products
          </Link>
          <Link href="/services" className="relative py-1 transition hover:text-[#B07C4F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C4A36A] after:transition-all after:duration-300 hover:after:w-full">
            Services
          </Link>
          <Link href="/quality" className="relative py-1 transition hover:text-[#B07C4F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C4A36A] after:transition-all after:duration-300 hover:after:w-full">
            Quality
          </Link>
          <Link href="/ceylon-tea" className="relative py-1 transition hover:text-[#B07C4F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C4A36A] after:transition-all after:duration-300 hover:after:w-full">
            Ceylon Tea
          </Link>
          <Link href="/news" className="relative py-1 transition hover:text-[#B07C4F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C4A36A] after:transition-all after:duration-300 hover:after:w-full">
            News
          </Link>
          <Link href="/contact" className="relative py-1 transition hover:text-[#B07C4F] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#C4A36A] after:transition-all after:duration-300 hover:after:w-full">
            Contact
          </Link>
        </nav>

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// 4. Footer Component
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative border-t-2 border-[#C4A36A]/30 bg-[#083335] text-[#F6F3EE] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #F6F3EE 1px, transparent 0)", backgroundSize: "24px 24px" }} />
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-12 grid gap-10 md:grid-cols-4">
        {/* Column 1 */}
        <div>
          <Image
            src="/brand/ceylon-roots-logomark.png"
            alt="Mist & Ember Exports"
            width={48}
            height={48}
            className="mb-4 opacity-90"
          />
          <p className="text-base text-[#E7E3DE] max-w-xs">
            Rooted in Sri Lanka. Grown for the world.  
            Mist & Ember Exports delivers the essence of Ceylon — tea, cinnamon, coconut, and more.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-base text-[#E7E3DE]">
            <li>
              <Link href="/about" className="transition hover:text-[#C4A36A] hover:underline underline-offset-2">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/products" className="transition hover:text-[#C4A36A] hover:underline underline-offset-2">
                Our Products
              </Link>
            </li>
            <li>
              <Link href="/services" className="transition hover:text-[#C4A36A] hover:underline underline-offset-2">
                Services
              </Link>
            </li>
            <li>
              <Link href="/quality" className="transition hover:text-[#C4A36A] hover:underline underline-offset-2">
                Quality & Sustainability
              </Link>
            </li>
            <li>
              <Link href="/ceylon-tea" className="transition hover:text-[#C4A36A] hover:underline underline-offset-2">
                Ceylon Tea
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-base text-[#E7E3DE]">
            <li>
              <Link href="/news" className="transition hover:text-[#C4A36A] hover:underline underline-offset-2">
                News & Stories
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="transition hover:text-[#C4A36A] hover:underline underline-offset-2">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="transition hover:text-[#C4A36A] hover:underline underline-offset-2">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-1 text-base text-[#E7E3DE]">
            <li>Colombo, Sri Lanka</li>
            <li>
              <a
                href="mailto:hello@mistandember.com"
                className="transition hover:text-[#C4A36A] underline underline-offset-2"
              >
                hello@mistandember.com
              </a>
            </li>
            <li>
              <a
                href="tel:+94700000000"
                className="transition hover:text-[#C4A36A] underline underline-offset-2"
              >
                +94 70 000 0000
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative z-10 border-t border-[#E7E3DE]/20 bg-[#0A3A3A] py-4">
        <div className="mx-auto max-w-6xl px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D4E0DE]">
          <p>© {new Date().getFullYear()} Mist & Ember Exports. All rights reserved.</p>
          <p>
            Built with ❤️ in Sri Lanka ·{" "}
            <Link
              href="https://www.mistandember.com"
              className="underline decoration-[#C4A36A]/70 underline-offset-2"
              target="_blank"
            >
              www.mistandember.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}


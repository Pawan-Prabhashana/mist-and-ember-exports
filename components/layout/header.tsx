"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/quality", label: "Quality" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E7E3DE] bg-[#F6F3EE]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Mist & Ember Exports — Home">
          {/* Use <img> to bypass Next/Image optimization and bust stale cache */}
          <img
            src="/brand/ceylon-roots-logo.png?v=1"
            alt="Mist & Ember Exports logo"
            width={42}
            height={42}
            className="block"
            loading="eager"
            decoding="async"
          />
          <span className="font-serif text-lg font-semibold tracking-tight text-[#083335]">
            Mist & Ember Exports
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#083335]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#B07C4F]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-md border border-[#083335] text-[#083335]"
        >
          <span
            className={`block h-[2px] w-4 bg-current transition-all duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-4 bg-current transition-all duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-[2px] w-4 bg-current transition-all duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-[#E7E3DE] bg-[#F6F3EE]"
          >
            <ul className="flex flex-col items-start px-6 py-4 space-y-3 text-sm text-[#083335]">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="w-full">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-lg px-2 py-2 transition hover:bg-[#083335]/5 hover:text-[#B07C4F]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

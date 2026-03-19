"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Services", "/services"],
  ["Quality", "/quality"],
  ["Ceylon Tea", "/ceylon-tea"],
  ["News", "/news"],
  ["Contact", "/contact"],
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        aria-expanded={open}
        className="relative flex flex-col justify-center items-center w-10 h-10 rounded-lg border border-[#083335] text-[#083335] focus:outline-none focus:ring-2 focus:ring-[#C4A36A] focus:ring-offset-2"
      >
        <span
          className={`block h-0.5 w-5 bg-current transition-all duration-300 origin-center ${
            open ? "rotate-45 translate-y-[5px]" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-current transition-all duration-300 my-1 ${
            open ? "opacity-0 scale-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-current transition-all duration-300 origin-center ${
            open ? "-rotate-45 -translate-y-[5px]" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E7E3DE] bg-[#F6F3EE] shadow-lg overflow-hidden"
          >
            <ul className="py-2">
              {NAV_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-base text-[#083335] hover:bg-[#083335]/5 hover:text-[#B07C4F] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

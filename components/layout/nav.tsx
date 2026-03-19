"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Quality", href: "/quality" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

/**
 * Navigation component (desktop)
 * --------------------------------------------------------------------
 * This file exports a <Nav /> component that renders the
 * desktop-size navigation links with an animated active indicator.
 *
 * Usage:
 *   <Nav className="hidden md:flex" />
 */

export default function Nav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={`flex items-center gap-8 text-sm font-medium text-[#083335] ${className}`}
      aria-label="Primary navigation"
    >
      {NAV_LINKS.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));

        if (link.external) {
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="relative transition hover:text-[#B07C4F]"
            >
              {link.label}
            </a>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className="relative flex flex-col items-center"
          >
            <span
              className={`transition-colors ${
                isActive ? "text-[#B07C4F]" : "hover:text-[#B07C4F]"
              }`}
            >
              {link.label}
            </span>
            {isActive && (
              <motion.span
                layoutId="nav-underline"
                className="absolute -bottom-1 h-[2px] w-5 rounded-full bg-[#B07C4F]"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// /lib/constants.ts
/**
 * Mist & Ember Exports – Global Constants Library
 *
 * This module centralizes constants, enums, and configuration tokens
 * shared across the Mist & Ember Exports application.
 *
 * Use this file for static values such as:
 * - API endpoints
 * - social media links
 * - company contact details
 * - default images
 * - language codes
 * - content directories
 * - etc.
 */

export const APP_NAME = "Mist & Ember Exports";
export const APP_TAGLINE = "Authentic Ceylon Exports";
export const APP_DESCRIPTION =
  "Mist & Ember Exports curates authentic Sri Lankan tea, cinnamon, coconut, and other natural products — combining heritage, quality, and global logistics.";

// -----------------------------------------------------------
// Directories & paths
// -----------------------------------------------------------

export const CONTENT_DIR = "/content";
export const DATA_DIR = "/data";
export const ASSETS_DIR = "/public";
export const NEWS_COLLECTION = "news";
export const PAGES_COLLECTION = "pages";

// -----------------------------------------------------------
// Social Media Links
// -----------------------------------------------------------

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/mistandemberexports",
  instagram: "https://www.instagram.com/mistandemberexports",
  linkedin: "https://www.linkedin.com/company/mistandemberexports",
  twitter: "https://twitter.com/mistandemberexports",
  youtube: "https://www.youtube.com/@mistandemberexports",
};

// -----------------------------------------------------------
// Contact Information
// -----------------------------------------------------------

export const CONTACT = {
  email: "info@mistandember.com",
  phone: "+94 11 234 5678",
  address: "No. 123, Galle Road, Colombo 03, Sri Lanka",
  mapUrl: "https://maps.google.com/?q=Mist+%26+Ember+Exports,+Colombo+03",
};

// -----------------------------------------------------------
// Default Assets
// -----------------------------------------------------------

export const DEFAULT_IMAGES = {
  logo: "/images/logo.svg",
  logoDark: "/images/logo-dark.svg",
  placeholder: "/images/placeholder.jpg",
  hero: "/images/hero-default.jpg",
  og: "/images/og-default.jpg",
};

// -----------------------------------------------------------
// SEO Defaults
// -----------------------------------------------------------

export const DEFAULT_SEO = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  url: "https://www.mistandember.com",
  image: DEFAULT_IMAGES.og,
  keywords: [
    "Mist & Ember Exports",
    "Sri Lanka exports",
    "Ceylon tea",
    "Ceylon cinnamon",
    "Sri Lanka tourism",
  ],
};

// -----------------------------------------------------------
// Supported Languages (for i18n / future expansion)
// -----------------------------------------------------------

export const LANGUAGES = {
  EN: "en",
  SI: "si",
  TA: "ta",
};

export const DEFAULT_LANG = LANGUAGES.EN;

// -----------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------

export const API_ENDPOINTS = {
  contactForm: "/api/contact",
  newsletter: "/api/newsletter",
  globeData: "/api/globe",
  sitemap: "/api/sitemap",
};

// -----------------------------------------------------------
// UI / Animation Settings
// -----------------------------------------------------------

export const UI = {
  themeStorageKey: "cr-theme",
  animationDelayBase: 0.1,
  maxScrollProgress: 1.0,
};

// -----------------------------------------------------------
// Date/Time Formats
// -----------------------------------------------------------

export const DATE_FORMATS = {
  display: {
    short: "MMM dd, yyyy",
    long: "MMMM dd, yyyy",
  },
  iso: "yyyy-MM-dd'T'HH:mm:ss'Z'",
};

// -----------------------------------------------------------
// Google / External Service IDs
// -----------------------------------------------------------

export const EXTERNAL_IDS = {
  googleAnalytics: "G-XXXXXXXXXX",
  facebookPixel: "XXXXXXXXXX",
  tripAdvisor: "https://www.tripadvisor.com/Profile/MistEmberExports",
};

// -----------------------------------------------------------
// Footer / Navigation Data
// -----------------------------------------------------------

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Destinations", href: "/destinations" },
  { name: "Experiences", href: "/experiences" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  company: [
    { name: "About Mist & Ember Exports", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Sustainability", href: "/sustainability" },
  ],
  explore: [
    { name: "Destinations", href: "/destinations" },
    { name: "Experiences", href: "/experiences" },
    { name: "Blog & News", href: "/news" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  social: SOCIAL_LINKS,
};

// -----------------------------------------------------------
// Email Templates
// -----------------------------------------------------------

export const EMAIL_TEMPLATES = {
  contactReply: "templates/contact-reply.html",
  bookingConfirm: "templates/booking-confirm.html",
};

// -----------------------------------------------------------
// Enum-like helpers
// -----------------------------------------------------------

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export enum CollectionType {
  News = "news",
  Pages = "pages",
  Data = "data",
}

// -----------------------------------------------------------
// Re-export as single default object
// -----------------------------------------------------------

export default {
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  CONTENT_DIR,
  DATA_DIR,
  ASSETS_DIR,
  NEWS_COLLECTION,
  PAGES_COLLECTION,
  SOCIAL_LINKS,
  CONTACT,
  DEFAULT_IMAGES,
  DEFAULT_SEO,
  LANGUAGES,
  DEFAULT_LANG,
  API_ENDPOINTS,
  UI,
  DATE_FORMATS,
  EXTERNAL_IDS,
  NAV_LINKS,
  FOOTER_LINKS,
  EMAIL_TEMPLATES,
  ThemeMode,
  CollectionType,
};

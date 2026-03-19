// /lib/seo/metadata.ts
/**
 * Mist & Ember Exports – Centralized metadata utilities for SEO & social sharing
 *
 * This file standardizes SEO metadata creation for all pages.
 * It is designed for use in Next.js 13+ `generateMetadata` functions
 * and custom head components.
 *
 * Features:
 * - Central default metadata for title, description, open graph, twitter, etc.
 * - Utility functions to merge and build per-page metadata.
 * - Safe defaults (no undefined meta tags).
 * - Handles absolute URL building and canonical tags.
 */

import type { Metadata } from "next";

// -----------------------------------------------------------
// Base site configuration (edit for Mist & Ember Exports brand)
// -----------------------------------------------------------

export const siteConfig = {
  name: "Mist & Ember Exports",
  slogan: "Authentic Ceylon Exports",
  description:
    "Mist & Ember Exports exports authentic Sri Lankan tea, cinnamon, coconut, and other natural products — combining heritage, quality, and global logistics.",
  keywords: [
    "Mist & Ember Exports",
    "Sri Lanka travel",
    "Sri Lanka tours",
    "luxury travel",
    "heritage tourism",
    "island adventures",
    "bespoke experiences",
  ],
  url: "https://www.mistandember.com",
  ogImage: "/images/og-default.jpg",
  twitterHandle: "@mistandemberexports",
  locale: "en_LK",
  siteName: "Mist & Ember Exports",
};

// -----------------------------------------------------------
// Utility functions
// -----------------------------------------------------------

function absoluteUrl(path: string): string {
  if (!path) return siteConfig.url;
  if (path.startsWith("http")) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build a Metadata object for Next.js with sensible defaults.
 */
export function buildMetadata(params?: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  keywords?: string[];
  type?: "website" | "article" | "profile" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): Metadata {
  const {
    title,
    description,
    image,
    url,
    noIndex,
    noFollow,
    keywords,
    type,
    publishedTime,
    modifiedTime,
    authors,
  } = params || {};

  const metaTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} – ${siteConfig.slogan}`;
  const metaDescription = description || siteConfig.description;
  const metaUrl = absoluteUrl(url || "");
  const metaImage = absoluteUrl(image || siteConfig.ogImage);

  const robots: Metadata["robots"] = {
    index: noIndex ? false : true,
    follow: noFollow ? false : true,
    googleBot: {
      index: noIndex ? "noindex" : "index",
      follow: noFollow ? "nofollow" : "follow",
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  };

  const combinedKeywords = Array.from(
    new Set([...(keywords || []), ...siteConfig.keywords])
  );

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: combinedKeywords,
    alternates: {
      canonical: metaUrl,
    },
    openGraph: {
      type: type || "website",
      locale: siteConfig.locale,
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.siteName,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    robots,
    authors: authors || [{ name: siteConfig.name }],
    category: "Travel & Tourism",
  };

  // Optional article metadata
  if (type === "article" && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      article: {
        publishedTime,
        modifiedTime,
        authors,
      },
    };
  }

  return metadata;
}

// -----------------------------------------------------------
// Prebuilt Metadata Presets
// -----------------------------------------------------------

/**
 * Default metadata for the homepage.
 */
export const defaultMetadata: Metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: siteConfig.ogImage,
});

/**
 * Generate metadata for a news/article page.
 */
export function newsMetadata(
  slug: string,
  params?: {
    title?: string;
    description?: string;
    image?: string;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  }
): Metadata {
  return buildMetadata({
    title: params?.title,
    description: params?.description,
    image: params?.image,
    url: `/news/${slug}`,
    type: "article",
    publishedTime: params?.publishedTime,
    modifiedTime: params?.modifiedTime,
    authors: params?.authors,
  });
}

/**
 * Generate metadata for static informational pages.
 */
export function pageMetadata(
  slug: string,
  params?: { title?: string; description?: string; image?: string }
): Metadata {
  return buildMetadata({
    title: params?.title,
    description: params?.description,
    image: params?.image,
    url: `/${slug}`,
    type: "website",
  });
}

/**
 * Metadata for 404 / Not Found page.
 */
export const notFoundMetadata: Metadata = buildMetadata({
  title: "Page Not Found",
  description:
    "Sorry, the page you are looking for cannot be found. Return to Mist & Ember Exports to continue exploring Sri Lanka.",
  url: "/404",
  noIndex: true,
  noFollow: true,
});

/**
 * Metadata for internal error or fallback pages.
 */
export const errorMetadata: Metadata = buildMetadata({
  title: "Something Went Wrong",
  description:
    "An unexpected error occurred. Please try again later or return to Mist & Ember Exports’ homepage.",
  url: "/error",
  noIndex: true,
  noFollow: true,
});

/**
 * Metadata for sitemap and robots.txt.
 */
export const seoMetaFiles = {
  sitemap: absoluteUrl("/sitemap.xml"),
  robots: absoluteUrl("/robots.txt"),
};

// -----------------------------------------------------------
// Helpers for social preview
// -----------------------------------------------------------

export function buildSocialImage(params?: {
  title?: string;
  subtitle?: string;
  bg?: string;
}): string {
  // In production, this could call an OG image generator route.
  // Here we just return a composed query URL.
  const title = encodeURIComponent(params?.title || siteConfig.name);
  const subtitle = encodeURIComponent(
    params?.subtitle || siteConfig.slogan
  );
  const bg = encodeURIComponent(params?.bg || siteConfig.ogImage);
  return `${siteConfig.url}/api/og?title=${title}&subtitle=${subtitle}&bg=${bg}`;
}

// -----------------------------------------------------------
// Export everything for reusability
// -----------------------------------------------------------

export default {
  siteConfig,
  absoluteUrl,
  buildMetadata,
  defaultMetadata,
  newsMetadata,
  pageMetadata,
  notFoundMetadata,
  errorMetadata,
  seoMetaFiles,
  buildSocialImage,
};

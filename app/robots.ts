// /app/robots.ts
import type { MetadataRoute } from "next";

/**
 * Generates robots.txt at /robots.txt
 * Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  // Prefer an env var for your canonical base URL; fallback to production domain
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://www.mistandember.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // If you need to hide drafts or admin routes later, add disallows here:
        // disallow: ["/admin", "/api/private"]
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ""), // e.g., mistandember.com
  };
}

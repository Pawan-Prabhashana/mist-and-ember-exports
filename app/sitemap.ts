// /app/sitemap.ts
import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

// You can change this or set it in .env.local as NEXT_PUBLIC_SITE_URL
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://www.mistandember.com";

// Helper: safely read products.json (if exists)
function getProducts(): string[] {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json");
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(raw);
    if (json && Array.isArray(json.items)) {
      return json.items.map((p: any) => `/products/${p.slug}`);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

// Helper: safely read news content folder (if exists)
function getNews(): string[] {
  try {
    const dir = path.join(process.cwd(), "content", "news");
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => `/news/${f.replace(/\.mdx$/, "")}`);
  } catch {
    return [];
  }
}

// ----------------------
// Sitemap generator
// ----------------------
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about",
    "/products",
    "/services",
    "/quality",
    "/ceylon-tea",
    "/news",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
  ];

  const productRoutes = getProducts();
  const newsRoutes = getNews();

  const allRoutes = [...staticRoutes, ...productRoutes, ...newsRoutes];

  const now = new Date().toISOString();

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1.0 : 0.7,
  }));
}

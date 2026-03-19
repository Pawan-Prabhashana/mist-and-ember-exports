// /lib/cms/queries.ts
/**
 * Mist & Ember Exports – High-level CMS queries on top of /lib/cms/client
 *
 * This module provides opinionated helpers for common page/data needs:
 * - Paginated news list (+tag filter, search, draft control)
 * - Single news article with prev/next neighbors
 * - All tags (with counts)
 * - Generic collection adjacency + sitemap entries
 * - Simple full-text search across collections
 * - Convenience getters for Pages and Data JSON
 *
 * All functions are server-friendly and rely on the filesystem CMS client.
 */

import {
  cms,
  type CMSDoc,
  type FrontMatterBase,
} from "./client";

// ————————————— Types —————————————

export type NewsFrontMatter = FrontMatterBase & {
  title: string;
  date: string;          // ISO date preferred
  author?: string;
  cover?: string;
  draft?: boolean;
  tags?: string[];
  excerpt?: string;
};

export type PageFrontMatter = FrontMatterBase & {
  title: string;
  draft?: boolean;
  seoTitle?: string;
  description?: string;
  cover?: string;
};

export type Pagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type PaginatedResult<T extends FrontMatterBase> = {
  items: CMSDoc<T>[];
  pagination: Pagination;
  /** Tag histogram across the current (pre-paginated) filtered set */
  tagCounts: Record<string, number>;
};

// ————————————— Internal helpers —————————————

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function buildPagination(total: number, page: number, perPage: number): Pagination {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = clamp(page, 1, totalPages);
  return {
    page: safePage,
    perPage,
    total,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  };
}

function countTags<T extends FrontMatterBase>(docs: CMSDoc<T>[]) {
  const counts: Record<string, number> = {};
  for (const d of docs) {
    const tags = Array.isArray(d.data.tags) ? d.data.tags : [];
    for (const t of tags) counts[t] = (counts[t] ?? 0) + 1;
  }
  return counts;
}

function normalizeQuery(q?: string) {
  return (q || "").trim().toLowerCase();
}

function docMatchesQuery<T extends FrontMatterBase>(doc: CMSDoc<T>, q: string) {
  if (!q) return true;
  const inTitle = (doc.data.title || "").toString().toLowerCase().includes(q);
  const inExcerpt = (doc.excerpt || "").toLowerCase().includes(q);
  const inBody = doc.body.toLowerCase().includes(q);
  const inTags = (doc.data.tags || []).some((t) => t.toLowerCase().includes(q));
  return inTitle || inExcerpt || inBody || inTags;
}

function scoreDoc<T extends FrontMatterBase>(doc: CMSDoc<T>, q: string): number {
  // Naive scoring: title match 3, tag 2, excerpt/body 1
  if (!q) return 0;
  let s = 0;
  const title = (doc.data.title || "").toString().toLowerCase();
  const excerpt = (doc.excerpt || "").toLowerCase();
  const body = doc.body.toLowerCase();
  const tags = (doc.data.tags || []).map((t) => t.toLowerCase());

  if (title.includes(q)) s += 3;
  if (tags.some((t) => t.includes(q))) s += 2;
  if (excerpt.includes(q)) s += 1;
  if (body.includes(q)) s += 1;
  return s;
}

// ————————————— Public API —————————————

/**
 * Get a paginated list of news posts.
 * Sorted by date (desc), filters out drafts by default.
 */
export async function getNewsList(params?: {
  page?: number;
  perPage?: number;
  tag?: string;
  includeDrafts?: boolean;
  query?: string; // simple full-text filter
}): Promise<PaginatedResult<NewsFrontMatter>> {
  const page = params?.page && params.page > 0 ? Math.floor(params.page) : 1;
  const perPage = params?.perPage && params.perPage > 0 ? Math.floor(params.perPage) : 9;
  const tag = params?.tag;
  const includeDrafts = !!params?.includeDrafts;
  const q = normalizeQuery(params?.query);

  // Load all (filtered by draft + tag), sorted by date desc
  let all = await cms.list<NewsFrontMatter>("news", {
    includeDrafts,
    sortBy: "date",
    desc: true,
    tag,
  });

  // Optional full-text query filter
  if (q) {
    all = all.filter((d) => docMatchesQuery(d, q));
  }

  const tagCounts = countTags(all);

  // Pagination
  const total = all.length;
  const pagination = buildPagination(total, page, perPage);
  const start = (pagination.page - 1) * pagination.perPage;
  const end = start + pagination.perPage;

  const items = all.slice(start, end);

  return { items, pagination, tagCounts };
}

/**
 * Get a single news article by slug, plus previous/next neighbors
 * (based on date desc ordering).
 */
export async function getNewsBySlug(slug: string, opts?: {
  includeDrafts?: boolean;
}): Promise<{
  doc: CMSDoc<NewsFrontMatter> | null;
  prev: CMSDoc<NewsFrontMatter> | null;
  next: CMSDoc<NewsFrontMatter> | null;
}> {
  const includeDrafts = !!opts?.includeDrafts;
  const doc = await cms.getBySlug<NewsFrontMatter>("news", slug, { includeDrafts });
  if (!doc) return { doc: null, prev: null, next: null };

  const all = await cms.list<NewsFrontMatter>("news", {
    includeDrafts,
    sortBy: "date",
    desc: true,
  });

  const index = all.findIndex((d) => d.slug === slug);
  const prev = index > 0 ? all[index - 1] : null;                 // previous in list (newer)
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null; // next in list (older)
  return { doc, prev, next };
}

/**
 * Get all tags used in the news collection, with counts.
 */
export async function getAllNewsTags(opts?: {
  includeDrafts?: boolean;
}): Promise<Record<string, number>> {
  const includeDrafts = !!opts?.includeDrafts;
  const all = await cms.list<NewsFrontMatter>("news", {
    includeDrafts,
    sortBy: "date",
    desc: true,
  });
  return countTags(all);
}

/**
 * Generic adjacency for any collection sorted by date desc.
 */
export async function getAdjacentBySlug<T extends FrontMatterBase = FrontMatterBase>(
  collection: string,
  slug: string,
  opts?: { includeDrafts?: boolean }
): Promise<{ prev: CMSDoc<T> | null; next: CMSDoc<T> | null }> {
  const includeDrafts = !!opts?.includeDrafts;
  const all = await cms.list<T>(collection, {
    includeDrafts,
    sortBy: "date",
    desc: true,
  });
  const index = all.findIndex((d) => d.slug === slug);
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
  };
}

/**
 * Simple full-text search across one or more collections.
 * Returns ranked results (desc by score), optionally limited.
 */
export async function searchContent<T extends FrontMatterBase = FrontMatterBase>(params: {
  query: string;
  collections?: string[]; // default: ['news', 'pages']
  includeDrafts?: boolean;
  limit?: number;
}): Promise<Array<{ collection: string; doc: CMSDoc<T>; score: number }>> {
  const q = normalizeQuery(params.query);
  if (!q) return [];

  const collections = params.collections && params.collections.length > 0
    ? params.collections
    : ["news", "pages"];

  const includeDrafts = !!params.includeDrafts;
  const limit = params.limit && params.limit > 0 ? params.limit : 25;

  const results: Array<{ collection: string; doc: CMSDoc<T>; score: number }> = [];

  for (const col of collections) {
    const list = await cms.list<T>(col, {
      includeDrafts,
      sortBy: "date",
      desc: true,
    });
    for (const doc of list) {
      if (!docMatchesQuery(doc, q)) continue;
      const score = scoreDoc(doc, q);
      if (score > 0) results.push({ collection: col, doc, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/**
 * Get a static page by slug from /content/pages.
 */
export async function getPageBySlug(slug: string, opts?: {
  includeDrafts?: boolean;
}): Promise<CMSDoc<PageFrontMatter> | null> {
  return cms.getBySlug<PageFrontMatter>("pages", slug, { includeDrafts: !!opts?.includeDrafts });
}

/**
 * Return all slugs for a given collection.
 */
export async function getSlugs(collection: string): Promise<string[]> {
  return cms.slugs(collection);
}

/**
 * Build minimal sitemap entries for given collections.
 * Pass a baseUrl to produce absolute URLs.
 */
export async function getSitemapEntries(params?: {
  baseUrl?: string;                // e.g., "https://www.mistandember.com"
  collections?: Array<{ name: string; path: (slug: string) => string }>;
  includeDrafts?: boolean;
}): Promise<
  Array<{
    url: string;
    lastmod?: string;
    changefreq?: "daily" | "weekly" | "monthly" | "yearly";
    priority?: number;
  }>
> {
  const baseUrl = (params?.baseUrl || "").replace(/\/+$/, "");
  const mappings =
    params?.collections && params.collections.length
      ? params.collections
      : [
          { name: "pages", path: (slug: string) => `/${slug}` },
          { name: "news", path: (slug: string) => `/news/${slug}` },
        ];
  const includeDrafts = !!params?.includeDrafts;

  const entries: Array<{
    url: string;
    lastmod?: string;
    changefreq?: "daily" | "weekly" | "monthly" | "yearly";
    priority?: number;
  }> = [];

  for (const m of mappings) {
    const docs = await cms.list(m.name, { includeDrafts, sortBy: "date", desc: true });
    for (const d of docs) {
      const rel = m.path(d.slug);
      const url = baseUrl ? `${baseUrl}${rel}` : rel;
      const last = d.data.updated || d.data.date || d.updatedAt?.toISOString() || d.createdAt?.toISOString();
      entries.push({
        url,
        lastmod: last ? new Date(last).toISOString() : undefined,
        changefreq: m.name === "news" ? "weekly" : "monthly",
        priority: m.name === "news" ? 0.7 : 0.5,
      });
    }
  }

  return entries;
}

/**
 * Convenience: read certifications.json from /data
 * (Useful for the Mist & Ember Exports About/Trust section.)
 */
export async function getCertifications<T = unknown>(): Promise<T> {
  return cms.readDataJson<T>("certifications.json");
}

/**
 * Convenience: list latest N news posts.
 */
export async function getLatestNews(limit = 6) {
  return cms.latestNews<NewsFrontMatter>(limit);
}

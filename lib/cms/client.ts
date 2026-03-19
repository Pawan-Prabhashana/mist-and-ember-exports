// /lib/cms/client.ts
/* 
  Mist & Ember Exports – CMS client (filesystem-first with tiny cache)

  What it does
  • Reads Markdown/MDX content from the local /content directory
  • Parses front-matter via gray-matter
  • Returns typed records with slug, front-matter, body, excerpt, readingTime
  • Loads JSON data from /data (e.g., certifications.json)
  • Lightweight in-memory TTL cache to avoid repeated disk hits
  • Safe on the Node/Edge split: throws a helpful error on Edge (no fs)

  Conventions
  • Content root: /content
    - Example collections: /content/news, /content/pages, /content/docs
  • File extensions supported: .md, .mdx
  • Front-matter fields commonly used: title, date, draft, tags, cover, excerpt
*/

import type { Stats } from "fs";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";

// ---------- Types ----------

export type FrontMatterBase = {
  title?: string;
  date?: string; // ISO string preferred
  updated?: string;
  draft?: boolean;
  tags?: string[];
  cover?: string;
  excerpt?: string;
  [key: string]: unknown;
};

export type CMSDoc<T extends FrontMatterBase = FrontMatterBase> = {
  /** File slug relative to its collection (e.g., "2025-01-sri-lanka-harvest") */
  slug: string;
  /** Absolute file path on disk */
  filepath: string;
  /** Raw body (Markdown/MDX) without front-matter */
  body: string;
  /** Front-matter data parsed and typed */
  data: T;
  /** Optional excerpt (explicit in FM or auto from first paragraph) */
  excerpt?: string;
  /** Estimated reading time in minutes (float) */
  readingTime: number;
  /** File timestamps (fs stats) */
  createdAt?: Date;
  updatedAt?: Date;
};

export type ListOptions = {
  /** include draft docs (default false) */
  includeDrafts?: boolean;
  /** sort key: 'date' | 'title' | 'updated' | 'slug' (default 'date') */
  sortBy?: "date" | "title" | "updated" | "slug";
  /** reverse order (default true when sortBy='date', else false) */
  desc?: boolean;
  /** limit number of items (default: unlimited) */
  limit?: number;
  /** tag filter (any match) */
  tag?: string;
};

export type GetOptions = {
  /** If true, includes draft docs (default false) */
  includeDrafts?: boolean;
};

export type CMSClient = {
  /** Returns all docs from a collection (e.g., "news", "pages") */
  list<T extends FrontMatterBase = FrontMatterBase>(
    collection: string,
    opts?: ListOptions
  ): Promise<CMSDoc<T>[]>;

  /** Returns a single doc by slug from a collection */
  getBySlug<T extends FrontMatterBase = FrontMatterBase>(
    collection: string,
    slug: string,
    opts?: GetOptions
  ): Promise<CMSDoc<T> | null>;

  /** Returns all slugs for a collection */
  slugs(collection: string): Promise<string[]>;

  /** Convenience: list latest news posts */
  latestNews<T extends FrontMatterBase = FrontMatterBase>(
    limit?: number
  ): Promise<CMSDoc<T>[]>;

  /** Reads a JSON data file from /data (e.g., "certifications.json") */
  readDataJson<T = unknown>(filename: `${string}.json`): Promise<T>;
};

// ---------- Config ----------

const CONTENT_ROOT = path.join(process.cwd(), "content");
const DATA_ROOT = path.join(process.cwd(), "data");
const VALID_EXTS = [".md", ".mdx"] as const;

// Default caching: 10 seconds is a sweet spot during dev; bump in prod if needed.
const DEFAULT_TTL_MS = process.env.NODE_ENV === "development" ? 5_000 : 10_000;

// ---------- Edge/runtime guard ----------

function ensureNodeFS() {
  // Next.js sets process.env.NEXT_RUNTIME='edge' on edge
  // Vercel Edge / Workers lack 'fs'. Provide a friendly hint.
  // Consumers can replace this client or route calls through server-only code.
  if (typeof process !== "undefined" && process.env.NEXT_RUNTIME === "edge") {
    throw new Error(
      "[cms] The filesystem CMS client cannot run on the Edge runtime. " +
        "Call it from a Node.js/Server Component or create a server action."
    );
  }
}

// ---------- Tiny in-memory TTL cache ----------

type CacheEntry<T> = { v: T; exp: number };
const cache = new Map<string, CacheEntry<unknown>>();

function setCache<T>(key: string, value: T, ttlMs = DEFAULT_TTL_MS) {
  cache.set(key, { v: value, exp: Date.now() + ttlMs });
}

function getCache<T>(key: string): T | undefined {
  const hit = cache.get(key);
  if (!hit) return;
  if (Date.now() > hit.exp) {
    cache.delete(key);
    return;
  }
  return hit.v as T;
}

function cacheKey(parts: string[]) {
  return parts.join("::");
}

// ---------- Utilities ----------

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function statSafe(p: string): Promise<Stats | null> {
  try {
    return await fs.stat(p);
  } catch {
    return null;
  }
}

function removeExt(filename: string) {
  return VALID_EXTS.reduce((acc, ext) => (acc.endsWith(ext) ? acc.slice(0, -ext.length) : acc), filename);
}

function isValidContentFile(name: string) {
  return VALID_EXTS.some((ext) => name.endsWith(ext));
}

function estimateReadingTime(text: string): number {
  // Approx 200 words/min
  const words = (text.trim().match(/\S+/g) || []).length;
  return Math.max(0.1, words / 200);
}

function coerceDate(d?: unknown): Date | undefined {
  if (!d) return undefined;
  if (d instanceof Date) return isNaN(+d) ? undefined : d;
  if (typeof d === "number") return new Date(d);
  if (typeof d === "string") {
    const dt = new Date(d);
    return isNaN(+dt) ? undefined : dt;
  }
  return undefined;
}

function autoExcerpt(body: string): string | undefined {
  // First non-empty paragraph
  const paras = body
    .split(/\n{2,}/g)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return paras[0];
}

async function readCollectionFiles(collection: string): Promise<string[]> {
  const dir = path.join(CONTENT_ROOT, collection);
  const exists = await pathExists(dir);
  if (!exists) return [];
  const entries = await fs.readdir(dir);
  return entries.filter(isValidContentFile).map((n) => path.join(dir, n));
}

async function readDocFile(filepath: string) {
  const raw = await fs.readFile(filepath, "utf8");
  const parsed = matter(raw, { excerpt: false }); // we'll generate our own fallback
  const body = parsed.content?.trim() ?? "";
  const excerpt = (parsed.data?.excerpt as string | undefined) || autoExcerpt(body);
  const created = await statSafe(filepath);
  const fm = parsed.data || {};

  const doc: CMSDoc = {
    slug: removeExt(path.basename(filepath)),
    filepath,
    body,
    data: fm as FrontMatterBase,
    excerpt,
    readingTime: estimateReadingTime(body),
    createdAt: created?.birthtime ?? created?.ctime ?? undefined,
    updatedAt: created?.mtime ?? undefined,
  };
  return doc;
}

function sortDocs(list: CMSDoc[], opts?: ListOptions): CMSDoc[] {
  const sortBy = opts?.sortBy ?? "date";
  const desc = opts?.desc !== undefined ? opts.desc : sortBy === "date";
  const factor = desc ? -1 : 1;

  const getKey = (d: CMSDoc) => {
    if (sortBy === "title") return (d.data.title || "").toString().toLowerCase();
    if (sortBy === "slug") return d.slug.toLowerCase();
    if (sortBy === "updated") {
      const u = coerceDate(d.data.updated) || d.updatedAt || d.createdAt || new Date(0);
      return +u;
    }
    // date
    const dt = coerceDate(d.data.date) || d.createdAt || new Date(0);
    return +dt;
  };

  const cloned = [...list];
  cloned.sort((a, b) => {
    const ka = getKey(a);
    const kb = getKey(b);
    if (ka < kb) return -1 * factor;
    if (ka > kb) return 1 * factor;
    return 0;
  });
  return cloned;
}

// ---------- Client implementation ----------

async function listDocs<T extends FrontMatterBase = FrontMatterBase>(
  collection: string,
  opts?: ListOptions
): Promise<CMSDoc<T>[]> {
  ensureNodeFS();

  const key = cacheKey(["list", collection, JSON.stringify(opts || {})]);
  const cached = getCache<CMSDoc<T>[]>(key);
  if (cached) return cached;

  const files = await readCollectionFiles(collection);
  if (files.length === 0) {
    setCache(key, [], DEFAULT_TTL_MS);
    return [];
  }

  const docsAll = await Promise.all(files.map(readDocFile));
  let docs = docsAll as CMSDoc<T>[];

  // Filter drafts unless requested
  if (!opts?.includeDrafts) {
    docs = docs.filter((d) => !d.data.draft);
  }

  // Tag filter
  if (opts?.tag) {
    docs = docs.filter((d) => Array.isArray(d.data.tags) && d.data.tags.includes(opts.tag!));
  }

  // Sort + limit
  docs = sortDocs(docs, opts);
  if (opts?.limit && opts.limit > 0) {
    docs = docs.slice(0, opts.limit);
  }

  setCache(key, docs, DEFAULT_TTL_MS);
  return docs;
}

async function getBySlug<T extends FrontMatterBase = FrontMatterBase>(
  collection: string,
  slug: string,
  opts?: GetOptions
): Promise<CMSDoc<T> | null> {
  ensureNodeFS();

  const key = cacheKey(["get", collection, slug, JSON.stringify(opts || {})]);
  const cached = getCache<CMSDoc<T> | null>(key);
  if (cached !== undefined) return cached;

  // Try .mdx first, then .md
  const mdxPath = path.join(CONTENT_ROOT, collection, `${slug}.mdx`);
  const mdPath = path.join(CONTENT_ROOT, collection, `${slug}.md`);

  let filepath: string | null = null;
  if (await pathExists(mdxPath)) filepath = mdxPath;
  else if (await pathExists(mdPath)) filepath = mdPath;

  if (!filepath) {
    setCache(key, null, DEFAULT_TTL_MS);
    return null;
  }

  const doc = (await readDocFile(filepath)) as CMSDoc<T>;
  if (!opts?.includeDrafts && doc.data.draft) {
    setCache(key, null, DEFAULT_TTL_MS);
    return null;
  }

  setCache(key, doc, DEFAULT_TTL_MS);
  return doc;
}

async function slugs(collection: string): Promise<string[]> {
  ensureNodeFS();

  const key = cacheKey(["slugs", collection]);
  const cached = getCache<string[]>(key);
  if (cached) return cached;

  const files = await readCollectionFiles(collection);
  const result = files.map((f) => removeExt(path.basename(f)));
  setCache(key, result, DEFAULT_TTL_MS);
  return result;
}

async function latestNews<T extends FrontMatterBase = FrontMatterBase>(
  limit = 6
): Promise<CMSDoc<T>[]> {
  return listDocs<T>("news", { limit, sortBy: "date", desc: true, includeDrafts: false });
}

async function readDataJson<T = unknown>(filename: `${string}.json`): Promise<T> {
  ensureNodeFS();

  const key = cacheKey(["data", filename]);
  const cached = getCache<T>(key);
  if (cached) return cached;

  const filePath = path.join(DATA_ROOT, filename);
  if (!(await pathExists(filePath))) {
    throw new Error(`[cms] Data file not found: ${filename}`);
  }
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as T;
  setCache(key, parsed, DEFAULT_TTL_MS);
  return parsed;
}

// ---------- Factory & default export ----------

export function createCMSClient(): CMSClient {
  return {
    list: listDocs,
    getBySlug,
    slugs,
    latestNews,
    readDataJson,
  };
}

// A convenient singleton for most apps
export const cms = createCMSClient();

/* ----------------------- Usage Examples -----------------------

1) Get latest news posts
   const posts = await cms.latestNews(5);

2) Get a single news article by slug
   const post = await cms.getBySlug<{
     title: string;
     date: string;
     author?: string;
     cover?: string;
     draft?: boolean;
     tags?: string[];
   }>("news", "2025-01-sri-lanka-harvest");

3) List all static pages
   const pages = await cms.list("pages", { sortBy: "title", desc: false });

4) Read /data/certifications.json
   const certs = await cms.readDataJson<{
     issuer: string;
     name: string;
     issuedOn: string;
     url?: string;
   }[]>("certifications.json");

---------------------------------------------------------------- */

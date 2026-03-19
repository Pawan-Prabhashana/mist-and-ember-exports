// /scripts/generate-og-images.mjs
/**
 * Ceylon Roots – Open Graph Image Generator
 *
 * Generates social preview (OG) images for content stored in /content/* using
 * front-matter (title, description, cover, tags...). It renders clean SVGs and
 * (optionally) PNGs using @resvg/resvg-js — no headless browser required.
 *
 * Defaults:
 *   - Collection: "news"
 *   - Size: 1200 x 630 (OG standard)
 *   - Output: /public/og/<collection>/<slug>.{svg|png}
 *
 * Requirements (add to devDependencies):
 *   npm i -D gray-matter @resvg/resvg-js
 *
 * Optional (if you want custom fonts):
 *   - Place fonts in /public/fonts (e.g., Inter-Bold.ttf, Inter-Regular.ttf)
 *   - The script will try to load them; if not found, it falls back gracefully.
 *
 * Usage examples:
 *   node scripts/generate-og-images.mjs
 *   node scripts/generate-og-images.mjs --collection news --png
 *   node scripts/generate-og-images.mjs --slug 2025-01-sri-lanka-harvest --png
 *   node scripts/generate-og-images.mjs --out public/og --width 1200 --height 630
 *   node scripts/generate-og-images.mjs --collection pages --limit 20
 *
 * Front-matter fields used (optional):
 *   title: string (recommended)
 *   description: string
 *   tags: string[]
 *   ogTitle / ogDescription / ogImage (override defaults)
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Resvg } from "@resvg/resvg-js";

// --------------------------- CLI args ---------------------------

const argv = new Map(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.split("=");
    return [k.replace(/^--/, ""), v ?? true];
  })
);

const COLLECTION = String(argv.get("collection") || "news"); // "news" | "pages" | ...
const ONLY_SLUG = argv.has("slug") ? String(argv.get("slug")) : null;
const OUT_ROOT = String(argv.get("out") || "public/og");
const WIDTH = Number(argv.get("width") || 1200);
const HEIGHT = Number(argv.get("height") || 630);
const LIMIT = argv.has("limit") ? Number(argv.get("limit")) : Infinity;
const GENERATE_PNG = argv.has("png"); // add --png to also emit PNGs
const DRY_RUN = argv.has("dry-run");

// --------------------------- Paths ---------------------------

const CWD = process.cwd();
const CONTENT_DIR = path.join(CWD, "content", COLLECTION);
const FONTS_DIR = path.join(CWD, "public", "fonts");
const LOGO_SVG_PATHS = [
  path.join(CWD, "public", "images", "logo.svg"),
  path.join(CWD, "public", "logo.svg"),
];

// --------------------------- Utilities ---------------------------

const log = (...a) => console.log("•", ...a);
const warn = (...a) => console.warn("⚠️ ", ...a);
const err = (...a) => console.error("❌", ...a);

function slugFromFilename(filename) {
  return filename.replace(/\.(md|mdx)$/i, "");
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function wrapText(words, maxCharsPerLine = 28, maxLines = 3) {
  const tokens = String(words || "").trim().split(/\s+/);
  const lines = [];
  let current = "";

  for (const t of tokens) {
    if ((current + " " + t).trim().length <= maxCharsPerLine) {
      current = (current + " " + t).trim();
    } else {
      lines.push(current);
      current = t;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (lines.length < maxLines && current) lines.push(current);

  // Ellipsize last line if we truncated
  const truncated = lines.length === maxLines && tokens.join(" ").length > lines.join(" ").length;
  if (truncated) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.replace(/.{0,2}$/, "") + "…";
  }
  return lines;
}

async function tryReadFirstExisting(paths) {
  for (const p of paths) {
    if (await fileExists(p)) {
      return fs.readFile(p, "utf8");
    }
  }
  return null;
}

// Try load optional fonts (Inter)
async function loadFonts() {
  const fonts = [];
  try {
    const regularPath = path.join(FONTS_DIR, "Inter-Regular.ttf");
    const boldPath = path.join(FONTS_DIR, "Inter-Bold.ttf");
    if (await fileExists(regularPath)) {
      const data = await fs.readFile(regularPath);
      fonts.push({ name: "Inter", weight: 400, style: "normal", data });
    }
    if (await fileExists(boldPath)) {
      const data = await fs.readFile(boldPath);
      fonts.push({ name: "Inter", weight: 700, style: "normal", data });
    }
  } catch {
    // ignore
  }
  return fonts;
}

// --------------------------- Theme / Branding ---------------------------

const BRAND = {
  siteName: "Ceylon Roots",
  tagline: "Authentic Sri Lankan Journeys",
  // Rich brown + gold accents (inspired by Sri Lankan heritage)
  bgGradientFrom: "#1c120a",
  bgGradientTo: "#3b2716",
  accent: "#d2a66d",
  accentDim: "#a17c49",
  text: "#ffffff",
  textDim: "rgba(255,255,255,0.82)",
};

// --------------------------- SVG Template ---------------------------

/**
 * Create a branded SVG string for an OG card.
 * If `logoSvg` is supplied, it’s embedded in the top-left.
 */
function makeSVG({
  width,
  height,
  title,
  subtitle,
  logoSvg, // string | null
  tags = [],
}) {
  const pad = 64;
  const titleLines = wrapText(title || BRAND.siteName, clamp(Math.round((width - pad * 2) / 26), 18, 34), 3);
  const subtitleLines = wrapText(subtitle || BRAND.tagline, 40, 2);
  const titleYStart = height / 2 - (titleLines.length * 64) / 2;

  const tagsStr =
    tags && tags.length
      ? `<g transform="translate(${pad}, ${height - pad - 46})">
           ${tags
             .slice(0, 4)
             .map(
               (t, i) => `
                 <g transform="translate(${i * 220}, 0)">
                   <rect rx="10" ry="10" width="200" height="46" fill="rgba(210,166,109,0.18)" stroke="${BRAND.accent}" />
                   <text x="100" y="30" text-anchor="middle" font-size="22" font-weight="600" fill="${BRAND.accent}">
                     ${escapeXml(t)}
                   </text>
                 </g>`
             )
             .join("")}
         </g>`
      : "";

  const logoBlock = logoSvg
    ? `<g transform="translate(${pad}, ${pad})">
         <g transform="scale(1)">
           ${logoSvg}
         </g>
       </g>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${BRAND.bgGradientFrom}" />
        <stop offset="100%" stop-color="${BRAND.bgGradientTo}" />
      </linearGradient>
      <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence baseFrequency="0.7" numOctaves="2" stitchTiles="stitch" type="fractalNoise" result="noise"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0 0.03 0.06 0.1"/>
        </feComponentTransfer>
      </filter>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="transparent" filter="url(#grain)"/>

    ${logoBlock}

    <!-- Accent line -->
    <rect x="${pad}" y="${pad + 80}" width="${width - pad * 2}" height="2" fill="${BRAND.accent}" opacity="0.5"/>
    
    <!-- Title -->
    ${titleLines
      .map(
        (line, i) => `
      <text
        x="${pad}"
        y="${titleYStart + i * 72}"
        font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        font-weight="700"
        font-size="64"
        fill="${BRAND.text}"
      >${escapeXml(line)}</text>`
      )
      .join("")}

    <!-- Subtitle -->
    ${subtitleLines
      .map(
        (line, i) => `
      <text
        x="${pad}"
        y="${titleYStart + titleLines.length * 72 + 40 + i * 34}"
        font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        font-weight="400"
        font-size="28"
        fill="${BRAND.textDim}"
      >${escapeXml(line)}</text>`
      )
      .join("")}

    <!-- Tag pills -->
    ${tagsStr}

    <!-- Brand mark -->
    <text x="${width - pad}" y="${height - pad}" text-anchor="end"
      font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
      font-weight="600" font-size="22" fill="${BRAND.accentDim}">
      ${BRAND.siteName}
    </text>
  </svg>`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// --------------------------- Core generation ---------------------------

async function loadLogoSvg() {
  const raw = await tryReadFirstExisting(LOGO_SVG_PATHS);
  if (!raw) return null;
  // Strip XML/doctype to allow embedding
  return raw.replace(/<\?xml[\s\S]*?\?>/g, "").replace(/<!DOCTYPE[\s\S]*?>/g, "");
}

async function listContentFiles() {
  if (!(await fileExists(CONTENT_DIR))) {
    throw new Error(`Collection folder not found: ${CONTENT_DIR}`);
  }
  const entries = await fs.readdir(CONTENT_DIR);
  return entries.filter((n) => n.endsWith(".md") || n.endsWith(".mdx"));
}

async function readDoc(fp) {
  const raw = await fs.readFile(fp, "utf8");
  const parsed = matter(raw);
  return {
    data: parsed.data || {},
    content: parsed.content || "",
  };
}

async function renderAndSave({ svg, outSvg, outPng, fonts }) {
  if (DRY_RUN) {
    log(`[dry-run] Would write: ${outSvg}${GENERATE_PNG ? ` & ${outPng}` : ""}`);
    return;
  }
  await ensureDir(path.dirname(outSvg));
  await fs.writeFile(outSvg, svg, "utf8");

  if (GENERATE_PNG) {
    // Render PNG at 1x
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: WIDTH }, // maintain aspect
      font: {
        loadSystemFonts: true, // helpful fallback in CI
        // Note: @resvg/resvg-js will automatically use system fonts;
        // we don't pass custom fonts here because we're drawing plain SVG text.
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    await fs.writeFile(outPng, pngBuffer);
  }
}

async function main() {
  log("Generating OG images…");
  log(`Collection: ${COLLECTION}`);
  if (ONLY_SLUG) log(`Only slug: ${ONLY_SLUG}`);
  log(`Size: ${WIDTH}x${HEIGHT}`);
  log(`Output root: ${OUT_ROOT}`);
  if (GENERATE_PNG) log("PNG rendering: enabled");
  if (DRY_RUN) warn("Dry-run mode: no files will be written");

  const logoSvg = await loadLogoSvg();
  if (!logoSvg) warn("Logo SVG not found (optional). Proceeding without logo.");

  const fonts = await loadFonts();
  if (!fonts.length) {
    warn("No Inter fonts found in /public/fonts (optional). Using system fonts.");
  }

  const files = await listContentFiles();
  const targets = files
    .filter((f) => (ONLY_SLUG ? slugFromFilename(f) === ONLY_SLUG : true))
    .slice(0, LIMIT);

  if (!targets.length) {
    warn("No matching content files found to generate OG images.");
    return;
  }

  const outDir = path.join(CWD, OUT_ROOT, COLLECTION);
  await ensureDir(outDir);

  let ok = 0;
  for (const file of targets) {
    const fp = path.join(CONTENT_DIR, file);
    const slug = slugFromFilename(file);
    const { data } = await readDoc(fp);

    const title = data.ogTitle || data.title || slug.replace(/-/g, " ");
    const subtitle = data.ogDescription || data.excerpt || data.description || BRAND.tagline;
    const tags = Array.isArray(data.tags) ? data.tags : [];

    const svg = makeSVG({
      width: WIDTH,
      height: HEIGHT,
      title,
      subtitle,
      logoSvg,
      tags,
    });

    const outSvg = path.join(outDir, `${slug}.svg`);
    const outPng = path.join(outDir, `${slug}.png`);

    await renderAndSave({ svg, outSvg, outPng, fonts });
    log(`✓ Generated OG for ${COLLECTION}/${slug}`);
    ok++;
  }

  log(`\n✅ Done. Generated ${ok} image${ok === 1 ? "" : "s"} in: ${path.relative(CWD, outDir)}`);
}

main().catch((e) => {
  err(e?.stack || e?.message || e);
  process.exit(1);
});


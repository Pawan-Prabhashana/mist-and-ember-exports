import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

// -----------------------------
// Types
// -----------------------------
type Product = {
  slug: string;
  title: string;
  category: "tea" | "cinnamon" | "coconut" | "others" | string;
  heroImage?: string;
  gallery?: string[];
  origin?: string;
  grades?: string[]; // e.g., ["OP", "FBOP", "BOP"]
  specifications?: Array<{ label: string; value: string }>;
  packagingOptions?: string[]; // e.g., ["Bulk 25kg", "Retail 250g", "Private label"]
  moq?: string; // min order qty
  capacity?: string; // monthly capacity
  description?: string;
  certifications?: string[]; // ["ISO22000","HACCP","Organic","Fairtrade"]
  downloadableSpec?: string; // /files/specs/tea-op.pdf
};

type ProductDB = {
  items: Product[];
};

// -----------------------------
// Data helpers
// -----------------------------
const DATA_PATH = path.join(process.cwd(), "data", "products.json");

function readDB(): ProductDB {
  if (!fs.existsSync(DATA_PATH)) {
    return { items: [] };
  }
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const json = JSON.parse(raw);
    if (json && Array.isArray(json.items)) {
      return json as ProductDB;
    }
  } catch {
    // ignore and return empty
  }
  return { items: [] };
}

function getAllProducts(): Product[] {
  return readDB().items;
}

function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

// -----------------------------
// Static generation hooks
// -----------------------------
export async function generateStaticParams() {
  const items = getAllProducts();
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  const title = `${product.title} — Mist & Ember Exports`;
  const description =
    product.description ||
    `Discover ${product.title} from Mist & Ember Exports — premium ${product.category} exported from Sri Lanka.`;

  const ogImage =
    product.heroImage ||
    "/images/hero/hero-tea-3840x2160.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// -----------------------------
// UI helpers
// -----------------------------
function fmtLabel(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Badge for certifications mapping to /public/images/certifications/*
const CERT_ICON_MAP: Record<string, string> = {
  ISO22000: "/images/certifications/iso22000.svg",
  HACCP: "/images/certifications/haccp.svg",
  Fairtrade: "/images/certifications/fairtrade.svg",
  Organic: "/images/certifications/organic.svg",
};

// -----------------------------
// Page
// -----------------------------
export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const {
    title,
    category,
    heroImage,
    gallery = [],
    origin,
    grades = [],
    specifications = [],
    packagingOptions = [],
    moq,
    capacity,
    description,
    certifications = [],
    downloadableSpec,
  } = product!;

  // Related products: same category, excluding self
  const related = getAllProducts()
    .filter((p) => p.category === category && p.slug !== product!.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Breadcrumb + Header */}
      <section className="border-b border-[#E7E3DE]">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-8 md:py-10">
          <nav className="text-sm text-[#4B5A56]">
            <Link href="/products" className="underline decoration-[#C4A36A]/70 underline-offset-2 hover:text-[#B07C4F]">
              Products
            </Link>{" "}
            / <span className="capitalize">{fmtLabel(category)}</span> /{" "}
            <span className="text-[#083335] font-medium">{title}</span>
          </nav>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-5xl font-semibold">{title}</h1>
              <p className="mt-2 text-sm uppercase tracking-widest text-[#4B5A56]">
                Category: <span className="capitalize">{fmtLabel(category)}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {certifications.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E7E3DE] bg-white px-3 py-1 text-xs"
                  title={c}
                >
                  {CERT_ICON_MAP[c] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={CERT_ICON_MAP[c]} alt={`${c} badge`} className="h-4 w-auto" />
                  ) : null}
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero media */}
      <section className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
        <Image
          src={heroImage || "/images/hero/hero-tea-3840x2160.jpg"}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F3EE] via-transparent to-transparent opacity-80" />
      </section>

      {/* Key info grid */}
      <section className="px-6 md:px-12 lg:px-20 py-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#E7E3DE] bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-semibold">At a Glance</h3>
            <dl className="mt-4 space-y-2 text-sm text-[#4B5A56]">
              {origin && (
                <div className="flex justify-between">
                  <dt className="font-medium text-[#083335]">Origin</dt>
                  <dd className="ml-4">{origin}</dd>
                </div>
              )}
              {grades.length > 0 && (
                <div className="flex justify-between">
                  <dt className="font-medium text-[#083335]">Grades</dt>
                  <dd className="ml-4">{grades.join(", ")}</dd>
                </div>
              )}
              {moq && (
                <div className="flex justify-between">
                  <dt className="font-medium text-[#083335]">MOQ</dt>
                  <dd className="ml-4">{moq}</dd>
                </div>
              )}
              {capacity && (
                <div className="flex justify-between">
                  <dt className="font-medium text-[#083335]">Capacity</dt>
                  <dd className="ml-4">{capacity}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {packagingOptions.slice(0, 3).map((p) => (
                <span key={p} className="rounded-full border border-[#E7E3DE] bg-white px-3 py-1 text-xs">
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/contact?product=${encodeURIComponent(title)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#083335] px-5 py-3 text-white transition hover:opacity-95"
              >
                Request a Quote →
              </Link>
              {downloadableSpec && (
                <a
                  href={downloadableSpec}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-5 py-3 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                >
                  Download Spec
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E7E3DE] bg-white p-6 shadow-sm md:col-span-2">
            <h3 className="font-serif text-xl font-semibold">Product Description</h3>
            <p className="mt-3 text-[#4B5A56] leading-relaxed">
              {description ||
                "Premium, responsibly sourced product from Sri Lanka — processed with strict quality control and traceability. Contact us for grades, private label, and export documentation support."}
            </p>

            {specifications.length > 0 && (
              <>
                <h4 className="mt-6 font-serif text-lg font-semibold">Specifications</h4>
                <div className="mt-3 overflow-hidden rounded-xl border border-[#E7E3DE]">
                  <table className="w-full text-sm">
                    <tbody>
                      {specifications.map((row, i) => (
                        <tr key={i} className="even:bg-[#FAF9F7]">
                          <td className="w-1/3 px-4 py-3 font-medium text-[#083335]">
                            {row.label}
                          </td>
                          <td className="px-4 py-3 text-[#4B5A56]">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {packagingOptions.length > 0 && (
              <>
                <h4 className="mt-6 font-serif text-lg font-semibold">Packaging Options</h4>
                <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-[#4B5A56] sm:grid-cols-2">
                  {packagingOptions.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 pb-6">
          <div className="mx-auto max-w-6xl">
            <h3 className="font-serif text-xl font-semibold mb-4">Gallery</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((src, idx) => (
                <div key={idx} className="relative h-56 w-full overflow-hidden rounded-2xl border border-[#E7E3DE] bg-white">
                  <Image
                    src={src}
                    alt={`${title} image ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h3 className="font-serif text-2xl font-semibold">You may also like</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <article
                  key={r.slug}
                  className="group overflow-hidden rounded-2xl border border-[#E7E3DE] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={r.heroImage || "/images/hero/hero-cinnamon-3840x2160.jpg"}
                      alt={r.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-[#4B5A56]">
                      {fmtLabel(r.category)}
                    </p>
                    <h4 className="mt-1 font-serif text-lg font-semibold">{r.title}</h4>
                    <div className="mt-3">
                      <Link
                        href={`/products/${r.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-4 py-2 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                      >
                        View Product →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

export const metadata: Metadata = {
  title: "Our Products — Mist & Ember Exports",
  description:
    "Explore premium Ceylon tea, cinnamon, coconut, and other authentic products from Sri Lanka. Export-grade quality, sustainable sourcing, and global logistics.",
};

type Product = {
  slug: string;
  title: string;
  category: "tea" | "cinnamon" | "coconut" | "others" | string;
  heroImage?: string;
  gallery?: string[];
  origin?: string;
  grades?: string[];
  specifications?: Array<{ label: string; value: string }>;
  packagingOptions?: string[];
  moq?: string;
  capacity?: string;
  description?: string;
  certifications?: string[];
  downloadableSpec?: string;
};

type ProductDB = { items: Product[] };

const DATA_PATH = path.join(process.cwd(), "data", "products.json");
const PAGE_SIZE = 12;

/* -------------------- Data helpers -------------------- */
function readDB(): ProductDB {
  if (!fs.existsSync(DATA_PATH)) return { items: [] };
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const json = JSON.parse(raw);
    if (json && Array.isArray(json.items)) return json as ProductDB;
  } catch {
    // ignore
  }
  return { items: [] };
}

function getAllProducts(): Product[] {
  return readDB().items;
}

/* -------------------- Utilities -------------------- */
function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function formatCategoryLabel(cat: string) {
  return cat.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function filterProducts(items: Product[], q?: string, category?: string) {
  let res = items;

  if (category) {
    const t = category.toLowerCase();
    res = res.filter((p) => (p.category || "").toLowerCase() === t);
  }

  if (q) {
    const needle = q.toLowerCase();
    res = res.filter((p) => {
      const hay = [
        p.slug,
        p.title,
        p.category,
        p.description,
        (p.grades || []).join(" "),
        (p.packagingOptions || []).join(" "),
        (p.certifications || []).join(" "),
        p.origin,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }

  return res;
}

function paginate<T>(arr: T[], page: number, pageSize: number) {
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(Math.max(1, page), pages);
  const start = (clamped - 1) * pageSize;
  const end = start + pageSize;
  return { page: clamped, pages, total, slice: arr.slice(start, end) };
}

/* -------------------- Page -------------------- */
export default function ProductsIndexPage({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string; page?: string };
}) {
  const q = (searchParams?.q || "").trim() || undefined;
  const category = (searchParams?.category || "").trim() || undefined;
  const page = Number(searchParams?.page || "1") || 1;

  const all = getAllProducts();

  const categories = uniq(
    all.map((p) => (p.category || "others").toLowerCase())
  ).sort((a, b) => a.localeCompare(b));

  const filtered = filterProducts(all, q, category);
  const { slice, pages, page: current, total } = paginate(
    filtered,
    page,
    PAGE_SIZE
  );

  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Header & Filters */}
      <section className="border-b border-[#E7E3DE]">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">Our Products</h1>
          <p className="mt-3 text-[#4B5A56] max-w-3xl">
            Tea, cinnamon, coconut, and more — responsibly sourced, expertly processed, and
            exported worldwide.
          </p>

          <form className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search products, grades, certifications…"
              className="rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
            />
            <select
              name="category"
              defaultValue={category || ""}
              className="rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {formatCategoryLabel(c)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl bg-[#083335] px-5 py-3 text-white transition hover:opacity-95"
            >
              Apply
            </button>
          </form>

          <p className="mt-3 text-sm text-[#4B5A56]">
            Showing <span className="font-medium">{slice.length}</span> of{" "}
            <span className="font-medium">{total}</span> products
            {q ? (
              <>
                {" "}
                for “<span className="font-medium">{q}</span>”
              </>
            ) : null}
            {category ? (
              <>
                {" "}
                in category “
                <span className="font-medium">
                  {formatCategoryLabel(category)}
                </span>
                ”
              </>
            ) : null}
            .
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 lg:px-20 py-10 md:py-16">
        {slice.length === 0 ? (
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-[#E7E3DE] bg-white p-8 text-center shadow-sm">
              <p className="text-[#4B5A56]">
                No products found. Try clearing filters or searching another term.
              </p>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-4 py-2 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                >
                  Reset filters
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {slice.map((p) => {
              const cover =
                p.heroImage ||
                (p.gallery && p.gallery[0]) ||
                "/images/hero/hero-tea-3840x2160.jpg";
              const grades = p.grades?.slice(0, 3) || [];

              return (
                <article
                  key={p.slug}
                  className="group overflow-hidden rounded-2xl border border-[#E7E3DE] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={cover}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-[#4B5A56]">
                      {formatCategoryLabel(p.category)}
                    </p>
                    <h2 className="mt-1 line-clamp-2 font-serif text-xl font-semibold">
                      {p.title}
                    </h2>

                    {/* Grades preview */}
                    {grades.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {grades.map((g) => (
                          <span
                            key={g}
                            className="rounded-full border border-[#E7E3DE] bg-white px-3 py-1 text-xs"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-4 py-2 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                      >
                        View details →
                      </Link>
                      <Link
                        href={`/contact?product=${encodeURIComponent(p.title)}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#083335] px-4 py-2 text-white transition hover:opacity-95"
                      >
                        Request a quote
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mx-auto mt-10 flex max-w-6xl items-center justify-between">
            <PaginationControls current={current} pages={pages} {...(q != null && { q })} {...(category != null && { category })} />
          </div>
        )}
      </section>
    </main>
  );
}

/* -------------------- Pagination Controls -------------------- */
function PaginationControls({
  current,
  pages,
  q,
  category,
}: {
  current: number;
  pages: number;
  q?: string;
  category?: string;
}) {
  const mk = (p: number) =>
    `/products?${[
      `page=${p}`,
      q ? `q=${encodeURIComponent(q)}` : "",
      category ? `category=${encodeURIComponent(category)}` : "",
    ]
      .filter(Boolean)
      .join("&")}`;

  return (
    <nav className="flex items-center gap-2" role="navigation" aria-label="Pagination">
      <Link
        aria-disabled={current <= 1}
        href={current > 1 ? mk(current - 1) : mk(1)}
        className={`rounded-xl border px-3 py-2 ${
          current <= 1
            ? "pointer-events-none border-[#E7E3DE] text-[#9AA6A2]"
            : "border-[#083335] text-[#083335] hover:bg-[#083335] hover:text-white"
        }`}
      >
        ← Prev
      </Link>

      <span className="text-sm text-[#4B5A56]">
        Page <span className="font-medium">{current}</span> of{" "}
        <span className="font-medium">{pages}</span>
      </span>

      <Link
        aria-disabled={current >= pages}
        href={current < pages ? mk(current + 1) : mk(pages)}
        className={`rounded-xl border px-3 py-2 ${
          current >= pages
            ? "pointer-events-none border-[#E7E3DE] text-[#9AA6A2]"
            : "border-[#083335] text-[#083335] hover:bg-[#083335] hover:text-white"
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}

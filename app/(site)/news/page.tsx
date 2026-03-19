import matter from "gray-matter";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

export const metadata: Metadata = {
  title: "News — Mist & Ember Exports",
  description:
    "Latest stories and updates from Mist & Ember Exports: Sri Lankan tea, cinnamon, coconut, sustainability, certifications, and more.",
};

type Frontmatter = {
  title: string;
  excerpt?: string;
  date?: string; // ISO
  coverImage?: string;
  tags?: string[];
  author?: string;
};

type NewsItem = {
  slug: string;
  frontmatter: Frontmatter;
};

const NEWS_DIR = path.join(process.cwd(), "content", "news");
const PAGE_SIZE = 9;

/** Read all MDX files and return their slug + frontmatter */
function getAllArticles(): NewsItem[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  const files = fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".mdx"));

  const items: NewsItem[] = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const full = path.join(NEWS_DIR, file);
      const raw = fs.readFileSync(full, "utf8");
      const { data } = matter(raw);

      const fm: Frontmatter = {
        title: String(data.title ?? slug.replace(/-/g, " ")),
        ...(data.excerpt != null && { excerpt: String(data.excerpt) }),
        ...(data.date != null && { date: String(data.date) }),
        ...(data.coverImage != null && { coverImage: String(data.coverImage) }),
        tags: Array.isArray(data.tags)
          ? data.tags.map((t: unknown) => String(t))
          : [],
        ...(data.author != null && { author: String(data.author) }),
      };

      return { slug, frontmatter: fm };
    })
    // sort by date desc, fall back to filename order
    .sort((a, b) => {
      const da = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const db = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      return db - da;
    });

  return items;
}

function filterArticles(
  items: NewsItem[],
  q?: string,
  tag?: string
): NewsItem[] {
  let res = items;

  if (q) {
    const needle = q.toLowerCase();
    res = res.filter(({ slug, frontmatter }) => {
      const hay =
        [
          slug,
          frontmatter.title,
          frontmatter.excerpt,
          (frontmatter.tags || []).join(" "),
          frontmatter.author,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
      return hay.includes(needle);
    });
  }

  if (tag) {
    const t = tag.toLowerCase();
    res = res.filter(({ frontmatter }) =>
      (frontmatter.tags || []).some((x) => x.toLowerCase() === t)
    );
  }

  return res;
}

function paginate<T>(arr: T[], page: number, pageSize: number) {
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(Math.max(1, page), pages);
  const start = (clamped - 1) * pageSize;
  const end = start + pageSize;
  return {
    page: clamped,
    pages,
    total,
    slice: arr.slice(start, end),
  };
}

function formatDate(iso?: string) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsIndexPage({
  searchParams,
}: {
  searchParams?: { q?: string; tag?: string; page?: string };
}) {
  const q = (searchParams?.q || "").trim() || undefined;
  const tag = (searchParams?.tag || "").trim() || undefined;
  const page = Number(searchParams?.page || "1") || 1;

  const all = getAllArticles();
  const filtered = filterArticles(all, q, tag);
  const { slice, pages, page: current, total } = paginate(
    filtered,
    page,
    PAGE_SIZE
  );

  const allTags = Array.from(
    new Set(all.flatMap((a) => a.frontmatter.tags || []))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Header */}
      <section className="border-b border-[#E7E3DE]">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">News & Stories</h1>
          <p className="mt-3 text-[#4B5A56]">
            Updates from Mist & Ember Exports — harvest seasons, certifications, sustainability,
            trade fairs, and more.
          </p>

          {/* Filters */}
          <form className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search news…"
              className="rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
            />
            <select
              name="tag"
              defaultValue={tag || ""}
              className="rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
            >
              <option value="">All tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl bg-[#083335] px-5 py-3 text-white hover:opacity-95"
            >
              Apply
            </button>
          </form>

          {/* Result count */}
          <p className="mt-3 text-sm text-[#4B5A56]">
            Showing <span className="font-medium">{slice.length}</span> of{" "}
            <span className="font-medium">{total}</span> articles
            {q ? (
              <>
                {" "}
                for query “<span className="font-medium">{q}</span>”
              </>
            ) : null}
            {tag ? (
              <>
                {" "}
                tagged “<span className="font-medium">{tag}</span>”
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
                No articles found. Try clearing filters or searching another term.
              </p>
              <div className="mt-4">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-4 py-2 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                >
                  Reset filters
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {slice.map(({ slug, frontmatter }) => {
              const date = formatDate(frontmatter.date);
              const cover =
                frontmatter.coverImage || "/images/hero/hero-tea-3840x2160.jpg";

              return (
                <article
                  key={slug}
                  className="group overflow-hidden rounded-2xl border border-[#E7E3DE] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={cover}
                      alt={frontmatter.title || slug}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority={false}
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-[#4B5A56]">
                      {date || "—"}
                    </p>
                    <h2 className="mt-2 line-clamp-2 font-serif text-xl font-semibold">
                      {frontmatter.title}
                    </h2>
                    {frontmatter.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-[#4B5A56]">
                        {frontmatter.excerpt}
                      </p>
                    )}

                    {frontmatter.tags && frontmatter.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {frontmatter.tags.slice(0, 4).map((t) => (
                          <Link
                            key={t}
                            href={`/news?tag=${encodeURIComponent(t)}`}
                            className="rounded-full border border-[#E7E3DE] bg-white px-3 py-1 text-xs hover:border-[#C4A36A]"
                          >
                            #{t}
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <Link
                        href={`/news/${slug}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-4 py-2 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                      >
                        Read more →
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
            <PaginationControls current={current} pages={pages} {...(q != null && { q })} {...(tag != null && { tag })} />
          </div>
        )}
      </section>
    </main>
  );
}

/** Simple pagination controls preserving q/tag filters */
function PaginationControls({
  current,
  pages,
  q,
  tag,
}: {
  current: number;
  pages: number;
  q?: string;
  tag?: string;
}) {
  const mk = (p: number) =>
    `/news?${[
      `page=${p}`,
      q ? `q=${encodeURIComponent(q)}` : "",
      tag ? `tag=${encodeURIComponent(tag)}` : "",
    ]
      .filter(Boolean)
      .join("&")}`;

  return (
    <nav
      className="flex items-center gap-2"
      role="navigation"
      aria-label="Pagination"
    >
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

import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

// Optional: map some common MDX elements to styled components
const MDXComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className={[
        "font-serif text-2xl md:text-3xl font-semibold mt-12 mb-4",
        props.className || "",
      ].join(" ")}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className={[
        "font-serif text-xl md:text-2xl font-semibold mt-10 mb-3",
        props.className || "",
      ].join(" ")}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      className={["text-[#4B5A56] leading-relaxed my-4", props.className || ""].join(" ")}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className={["list-disc pl-6 my-4 space-y-2 text-[#4B5A56]", props.className || ""].join(
        " "
      )}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      className={[
        "underline decoration-[#C4A36A]/70 underline-offset-2 hover:text-[#B07C4F] transition",
        props.className || "",
      ].join(" ")}
      target={props.target || "_blank"}
      rel={props.rel || "noreferrer"}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // For MDX inline images (fallback). Prefer Next <Image> in content when possible.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      className={[
        "rounded-xl my-6 shadow-md border border-[#E7E3DE]",
        props.className || "",
      ].join(" ")}
      alt={props.alt || ""}
    />
  ),
};

type Frontmatter = {
  title: string;
  excerpt?: string;
  date?: string; // ISO date string
  coverImage?: string; // e.g., /images/hero/hero-tea-3840x2160.jpg
  tags?: string[];
  author?: string;
};

const NEWS_DIR = path.join(process.cwd(), "content", "news");

function getAllNewsSlugs(): string[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

async function getArticle(slug: string) {
  const filePath = path.join(NEWS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf8");

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    components: MDXComponents,
    options: {
      parseFrontmatter: true,
    },
  });

  return {
    slug,
    content,
    frontmatter,
  };
}

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};

  const { frontmatter } = article;
  const title = frontmatter.title
    ? `${frontmatter.title} — Mist & Ember Exports`
    : "News — Mist & Ember Exports";
  const description =
    frontmatter.excerpt ||
    "Latest stories and updates from Mist & Ember Exports: Sri Lankan tea, cinnamon, coconut, and more.";
  const ogImage =
    frontmatter.coverImage || "/og/og-home.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const { content, frontmatter } = article;
  const { title, excerpt, date, coverImage, tags = [], author } = frontmatter || {};

  // Format date (fallback to raw if invalid)
  let prettyDate = date;
  try {
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        prettyDate = d.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }
  } catch {
    // ignore formatting errors
  }

  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Header / Hero */}
      <section className="relative overflow-hidden border-b border-[#E7E3DE]">
        <div className="px-6 md:px-12 lg:px-20 py-14 md:py-20 max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#4B5A56]">
              Mist & Ember Exports — News
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-semibold leading-tight">
              {title || "Untitled"}
            </h1>
            {excerpt && <p className="mt-4 text-[#4B5A56]">{excerpt}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#4B5A56]">
              {prettyDate && <span>{prettyDate}</span>}
              {author && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>By {author}</span>
                </>
              )}
              {tags.length > 0 && (
                <>
                  <span aria-hidden="true">•</span>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[#E7E3DE] bg-white px-3 py-1 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cover image */}
        {coverImage && (
          <div className="relative h-[40vh] min-h-[280px] w-full">
            <Image
              src={coverImage}
              alt={title || "Cover image"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F6F3EE] to-transparent opacity-70" />
          </div>
        )}
      </section>

      {/* Article body */}
      <section className="px-6 md:px-12 lg:px-20 py-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article className="prose max-w-none prose-headings:font-serif prose-p:text-[#4B5A56] prose-li:text-[#4B5A56] prose-img:rounded-xl prose-img:shadow-md">
            {content}
          </article>

          {/* Sidebar */}
          <aside className="order-first lg:order-last">
            <div className="sticky top-6 rounded-2xl bg-white p-5 border border-[#E7E3DE] shadow-sm">
              <h3 className="font-serif text-lg font-semibold">More News</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {getAllNewsSlugs()
                  .filter((s) => s !== params.slug)
                  .slice(0, 6)
                  .map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/news/${slug}`}
                        className="hover:text-[#B07C4F] transition-colors underline decoration-[#C4A36A]/70 underline-offset-2"
                      >
                        {slug.replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Back link */}
        <div className="mx-auto max-w-6xl mt-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-xl border border-[#083335] px-4 py-2 text-[#083335] transition hover:bg-[#083335] hover:text-white"
          >
            ← Back to News
          </Link>
        </div>
      </section>
    </main>
  );
}

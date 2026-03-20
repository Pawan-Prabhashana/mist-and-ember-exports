import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Products — Mist & Ember Exports",
  description:
    "Explore premium Ceylon tea, cinnamon, frozen fruits, and other authentic products from Sri Lanka. Export-grade quality, sustainable sourcing, and global logistics.",
};

type ProductCard = {
  name: string;
  gradeType: string;
  spec: string;
  img: string;
};

const SECTIONS: { title: string; intro: string; products: ProductCard[] }[] = [
  {
    title: "Ceylon Tea",
    intro: "Premium Sri Lankan tea — orthodox, green, and white — sourced from highland estates and prepared for global export.",
    products: [
      {
        name: "Orthodox Black Tea",
        gradeType: "OP / BOP / BOPF",
        spec: "Classic Sri Lankan export tea with bright liquor and strong aroma.",
        img: "/images/products/tea/tea-1.jpg",
      },
      {
        name: "Ceylon Green Tea",
        gradeType: "Gunpowder / Sencha Style",
        spec: "Fresh, clean cup profile prepared for retail and bulk export.",
        img: "/images/products/tea/tea-2.jpg",
      },
      {
        name: "Ceylon White Tea",
        gradeType: "Silver Tips / Golden Tips",
        spec: "Premium specialty tea with delicate leaf appearance and refined character.",
        img: "/images/products/tea/tea-3.jpg",
      },
    ],
  },
  {
    title: "Ceylon Cinnamon",
    intro: "True Ceylon cinnamon quills — from premium Alba to commercial grades — for food manufacturing and retail export.",
    products: [
      {
        name: "Ceylon Cinnamon Quills",
        gradeType: "Alba",
        spec: "Finest premium quill grade for high-end export markets.",
        img: "/images/products/cinnamon/cinnamon-1.jpg",
      },
      {
        name: "Ceylon Cinnamon Quills",
        gradeType: "C5 Special / C5",
        spec: "Popular export grade with clean appearance and balanced flavor.",
        img: "/images/products/cinnamon/cinnamon-2.jpg",
      },
      {
        name: "Ceylon Cinnamon Quills",
        gradeType: "M5 / H1",
        spec: "Commercial export grades suitable for bulk orders and food manufacturing.",
        img: "/images/products/cinnamon/cinnamon-3.jpg",
      },
    ],
  },
  {
    title: "Frozen Fruits",
    intro: "Tropical fruits processed for export — chunks, pulp, and puree — with consistent quality for beverage and food applications.",
    products: [
      {
        name: "Frozen Pineapple",
        gradeType: "Chunks / Pulp",
        spec: "Tropical fruit processed for export with bright flavor and consistent quality.",
        img: "/images/products/others/frozen-1.jpg",
      },
      {
        name: "Frozen Passion Fruit",
        gradeType: "Pulp / Puree",
        spec: "High-aroma tropical fruit prepared for beverage and food applications.",
        img: "/images/products/others/frozen-2.jpg",
      },
      {
        name: "Frozen Papaya or Soursop",
        gradeType: "Pulp / Cubes",
        spec: "Value-added tropical fruit line suitable for retail and bulk export supply.",
        img: "/images/products/others/frozen-3.jpg",
      },
    ],
  },
];

function ProductCard({ product }: { product: ProductCard }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E7E3DE] bg-white shadow-[0_8px_30px_rgba(8,51,53,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(8,51,53,0.1)] hover:border-[#C4A36A]/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6F3EE]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-[#083335]">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-[#C4A36A]">
          {product.gradeType}
        </p>
        <p className="mt-2 text-sm text-[#4B5A56] leading-relaxed">
          {product.spec}
        </p>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Header */}
      <section className="border-b border-[#E7E3DE] bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">
            Our Products
          </h1>
          <div className="mt-4 h-px w-16 bg-[#C4A36A]/60" />
          <p className="mt-4 text-[#4B5A56] max-w-2xl">
            Ceylon tea, cinnamon, and frozen fruits — responsibly sourced,
            expertly processed, and exported worldwide.
          </p>
        </div>
      </section>

      {/* Product Sections */}
      {SECTIONS.map((section, sectionIdx) => (
        <section
          key={section.title}
          className={
            sectionIdx % 2 === 0
              ? "bg-[#F6F3EE]"
              : "bg-white border-y border-[#E7E3DE]/60"
          }
        >
          <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
            <div className="mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-[#083335]">
                {section.title}
              </h2>
              <div className="mt-2 h-px w-12 bg-[#C4A36A]/50" />
              <p className="mt-4 text-[#4B5A56] max-w-2xl">
                {section.intro}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.products.map((product) => (
                <ProductCard key={`${section.title}-${product.gradeType}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border-t border-[#E7E3DE] bg-[#083335] text-[#F6F3EE]">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-14 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">
            Bulk Orders & Export Inquiries
          </h2>
          <p className="mt-4 text-[#E7E3DE]/90 max-w-xl mx-auto">
            Ready to source premium Ceylon products? Contact us for MOQs,
            specifications, and delivery terms.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C4A36A] px-6 py-3 font-medium text-[#083335] transition hover:bg-[#C4A36A]/90 hover:opacity-95"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#F6F3EE] px-6 py-3 font-medium text-[#F6F3EE] transition hover:bg-[#F6F3EE] hover:text-[#083335]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

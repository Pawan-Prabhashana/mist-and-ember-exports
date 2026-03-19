import ProductCard from "@/components/product/product-card";
import ProductFilter, { ProductFilterState } from "@/components/product/product-filter";
import { useEffect, useState } from "react";

const CATEGORIES = [
  { id: "tea", label: "Tea", count: 42 },
  { id: "spices", label: "Spices", count: 31 },
  { id: "skincare", label: "Skincare", count: 12 },
];

const TAGS = ["organic", "gift", "limited", "best-seller"];

const PRODUCTS = [
  { id: 1, name: "Ceylon Cinnamon Tea", image: "/p1.jpg", price: "$14.99", rating: 4.6, stock: 12, category: "tea", tags: ["organic", "best-seller"] },
  { id: 2, name: "Coconut Body Scrub", image: "/p2.jpg", price: "$9.99", rating: 4.2, stock: 0, category: "skincare", tags: ["gift"] },
  // ...
];

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFilterState>({
    query: "",
    categories: [],
    tags: [],
    priceMin: undefined,
    priceMax: undefined,
    ratingMin: undefined,
    inStockOnly: false,
    sort: "relevance",
  });

  const [visible, setVisible] = useState(PRODUCTS);

  useEffect(() => {
    let list = PRODUCTS.slice();

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (filters.categories.length) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.tags.length) {
      list = list.filter((p) => filters.tags.every((t) => p.tags.includes(t)));
    }
    if (filters.inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }
    if (filters.ratingMin) {
      list = list.filter((p) => p.rating >= (filters.ratingMin ?? 0));
    }
    // price parsing demo (strip $)
    const toNum = (s: string) => Number(String(s).replace(/[^0-9.]/g, "")) || 0;
    if (filters.priceMin !== undefined) {
      list = list.filter((p) => toNum(p.price) >= (filters.priceMin ?? 0));
    }
    if (filters.priceMax !== undefined) {
      list = list.filter((p) => toNum(p.price) <= (filters.priceMax ?? Infinity));
    }
    // sort
    switch (filters.sort) {
      case "price_asc":
        list.sort((a, b) => toNum(a.price) - toNum(b.price));
        break;
      case "price_desc":
        list.sort((a, b) => toNum(b.price) - toNum(a.price));
        break;
      case "rating_desc":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        list.sort((a, b) => (b.id as number) - (a.id as number));
        break;
      default:
        break; // "relevance" keep as-is
    }

    setVisible(list);
  }, [filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <ProductFilter
        categories={CATEGORIES}
        tags={TAGS}
        priceBounds={{ min: 0, max: 100 }}
        syncToUrl
        onChange={setFilters}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            name={p.name}
            image={p.image}
            price={p.price}
            description=""
          />
        ))}
      </div>
    </div>
  );
}

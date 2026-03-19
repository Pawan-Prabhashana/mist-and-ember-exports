import HeroCinematic from "@/components/hero/hero-cinematic";

export default function HomeHero() {
  return (
    <HeroCinematic
      title={"Rooted in Ceylon.<br/>Grown for the World."}
      subtitle="Authentic Ceylon tea, cinnamon, coconut and other natural exports — where heritage meets innovation."
      ctas={[
        { label: "Explore Products", href: "/products", variant: "primary" },
        { label: "About Us", href: "/about", variant: "secondary" },
      ]}
      video={{
        webm: "/video/hero-leaves.webm",
        mp4: "/video/hero-leaves.mp4",
        poster: "/images/hero/hero-tea-3840x2160.jpg",
      }}
      imageFallback="/images/hero/hero-tea-3840x2160.jpg"
      heightVh={100}
      overlayColor="#083335"
      parallax
      grain
      compact
      center
    >
      {/* Optional children: certifications, chips, etc. */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {["ISO 22000", "HACCP", "Fairtrade", "Organic"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#F6F3EE]/50 px-3 py-1 text-xs text-[#F6F3EE]/90"
          >
            {tag}
          </span>
        ))}
      </div>
    </HeroCinematic>
  );
}

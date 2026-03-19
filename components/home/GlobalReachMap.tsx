"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Equirectangular: viewBox 0 0 1000 500 (matches standard 2:1 world maps)
function toXY(lon: number, lat: number): [number, number] {
  return [((lon + 180) / 360) * 1000, ((90 - lat) / 180) * 500];
}

function curvedPath(x1: number, y1: number, x2: number, y2: number): string {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cpx = midX - dy * 0.15;
  const cpy = midY + dx * 0.15;
  return `M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`;
}

const EXPORT_COUNTRIES: { name: string; coords: [number, number] }[] = [
  { name: "South Korea", coords: [127.0, 37.5] },
  { name: "Malaysia", coords: [101.7, 3.1] },
  { name: "Iraq", coords: [44.4, 33.3] },
  { name: "Russia", coords: [37.6, 55.8] },
  { name: "Türkiye", coords: [32.9, 39.9] },
  { name: "Libya", coords: [13.2, 32.9] },
  { name: "U.A.E.", coords: [54.4, 24.5] },
  { name: "Chile", coords: [-70.7, -33.4] },
  { name: "China", coords: [116.4, 39.9] },
  { name: "Iran", coords: [51.4, 35.7] },
  { name: "Azerbaijan", coords: [49.9, 40.4] },
  { name: "Saudi Arabia", coords: [46.7, 24.7] },
  { name: "Syria", coords: [36.3, 33.5] },
  { name: "Germany", coords: [13.4, 52.5] },
  { name: "United States", coords: [-74.0, 40.7] },
  { name: "Japan", coords: [139.7, 35.7] },
  { name: "Jordan", coords: [35.9, 31.9] },
  { name: "Taiwan", coords: [121.5, 25.0] },
  { name: "Poland", coords: [21.0, 52.2] },
  { name: "Hong Kong", coords: [114.2, 22.3] },
  { name: "Belgium", coords: [4.4, 50.9] },
  { name: "Kuwait", coords: [47.8, 29.4] },
];

const COLOMBO: [number, number] = [79.85, 6.93];
const DARK_GREEN = "#083335";
const ACCENT_GOLD = "#C4A36A";
const CREAM = "#F6F3EE";

const colomboXY = toXY(COLOMBO[0], COLOMBO[1]);

export default function GlobalReachMap() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: `linear-gradient(165deg, ${DARK_GREEN} 0%, #0a3d40 50%, ${DARK_GREEN} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(${CREAM} 1px, transparent 1px), linear-gradient(90deg, ${CREAM} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 text-center">
        <h2 className="font-serif text-2xl md:text-4xl font-semibold tracking-wide text-[#F6F3EE]">
          We proudly export Sri Lankan excellence to 20+ countries.
        </h2>
        <p className="mt-3 text-[#E7E3DE]/90 text-sm md:text-base max-w-2xl mx-auto">
          From Colombo to leading markets across Asia, the Middle East, Europe, and the Americas.
        </p>
        <div className="mx-auto mt-4 h-px w-16 bg-[#C4A36A]/60" />

        {/* Map container - always renders visible content */}
        <div
          className="relative w-full mt-10 md:mt-14 mx-auto rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${DARK_GREEN} 0%, #0a3d40 50%, ${DARK_GREEN} 100%)`,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(196,163,106,0.2)",
            minHeight: 320,
          }}
        >
          <div className="relative w-full" style={{ aspectRatio: "2/1", minHeight: 320 }}>
            {/* 1. Actual world map background - img for reliability */}
            <div className="absolute inset-0">
              <img
                src="/images/world-map.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                loading="eager"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${DARK_GREEN}50 100%)`,
                }}
              />
            </div>

            {/* 2. SVG overlay: routes, markers, particles */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="rsm-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="rsm-colombo-glow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base route tracks */}
              {EXPORT_COUNTRIES.map((country) => {
                const [x1, y1] = toXY(country.coords[0], country.coords[1]);
                const d = curvedPath(x1, y1, colomboXY[0], colomboXY[1]);
                return (
                  <path
                    key={`track-${country.name}`}
                    d={d}
                    fill="none"
                    stroke={DARK_GREEN}
                    strokeWidth={2.5}
                    strokeOpacity={0.4}
                  />
                );
              })}

              {/* Animated route lines */}
              {EXPORT_COUNTRIES.map((country, i) => {
                const [x1, y1] = toXY(country.coords[0], country.coords[1]);
                const d = curvedPath(x1, y1, colomboXY[0], colomboXY[1]);
                return (
                  <motion.path
                    key={`line-${country.name}`}
                    d={d}
                    fill="none"
                    stroke={ACCENT_GOLD}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.95 }}
                    transition={{
                      delay: 0.2 + i * 0.06,
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                );
              })}

              {/* Flowing particles */}
              {EXPORT_COUNTRIES.map((country, i) => {
                const [x1, y1] = toXY(country.coords[0], country.coords[1]);
                const d = curvedPath(x1, y1, colomboXY[0], colomboXY[1]);
                return (
                  <path
                    key={`flow-${country.name}`}
                    d={d}
                    fill="none"
                    stroke={CREAM}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="6 20"
                    strokeOpacity={0.8}
                    style={{
                      animation: "flowParticle 2s linear infinite",
                      animationDelay: `${0.5 + i * 0.15}s`,
                    }}
                  />
                );
              })}

              {/* Glowing destination markers */}
              {EXPORT_COUNTRIES.map((country, i) => {
                const [x, y] = toXY(country.coords[0], country.coords[1]);
                return (
                  <g key={country.name}>
                    <title>{country.name}</title>
                    <motion.g
                      transform={`translate(${x},${y})`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.1 + i * 0.04,
                        type: "spring",
                        stiffness: 260,
                        damping: 16,
                      }}
                    >
                      <circle
                        r={8}
                        fill={ACCENT_GOLD}
                        fillOpacity={0.4}
                        stroke={CREAM}
                        strokeWidth={2}
                        filter="url(#rsm-glow)"
                      />
                      <motion.circle
                        r={5}
                        fill={ACCENT_GOLD}
                        stroke={CREAM}
                        strokeWidth={1.5}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                      <circle r={2.5} fill={CREAM} />
                    </motion.g>
                  </g>
                );
              })}

              {/* Colombo hub */}
              <g transform={`translate(${colomboXY[0]},${colomboXY[1]})`}>
                <title>Colombo, Sri Lanka</title>
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 200,
                    damping: 14,
                  }}
                  filter="url(#rsm-colombo-glow)"
                >
                  <motion.circle
                    r={28}
                    fill={ACCENT_GOLD}
                    fillOpacity={0.2}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.circle
                    r={18}
                    fill={ACCENT_GOLD}
                    fillOpacity={0.35}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  />
                  <circle
                    r={12}
                    fill={DARK_GREEN}
                    stroke={ACCENT_GOLD}
                    strokeWidth={3}
                  />
                  <circle r={6} fill={ACCENT_GOLD} />
                </motion.g>
              </g>
            </svg>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-[#F6F3EE] px-6 py-3 text-[#083335] font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg"
          >
            Become a Partner →
          </Link>
          <Link
            href="/services"
            className="rounded-xl border-2 border-[#C4A36A] px-6 py-3 text-[#F6F3EE] font-medium transition-all duration-300 hover:bg-[#C4A36A]/20"
          >
            Learn About Our Process
          </Link>
        </div>
      </div>
    </section>
  );
}

// 🌿 Ceylon Roots — Next.js configuration (Next 14+ / App Router)
// Save as: next.config.mjs

/** @type {import('next').NextConfig} */

// ——— Content Security Policy ———
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "script-src 'self' 'strict-dynamic' 'unsafe-inline' https:",
  "style-src 'self' 'unsafe-inline' https:",
  "connect-src 'self' https:",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  // output: "standalone", // disabled - causes ENOENT in some envs

  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "media.graphassets.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "ceylonroots.com" },
      // add specific subdomains explicitly if you use them, e.g.:
      // { protocol: "https", hostname: "static.ceylonroots.com" },
    ],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source:
          "/:all*(js|css|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },

  async redirects() {
    const redirects = [
      { source: "/our-story", destination: "/about", permanent: true },
    ];
    if (process.env.NODE_ENV === "production") {
      redirects.push({
        source: "/:path*",
        has: [{ type: "host", value: "www.ceylonroots.com" }],
        destination: "https://ceylonroots.com/:path*",
        permanent: true,
      });
    }
    return redirects;
  },

  async rewrites() {
    return { beforeFiles: [], afterFiles: [], fallback: [] };
  },

  // experimental.optimizePackageImports removed — was causing __webpack_modules__ errors in dev

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  webpack: (config, { isServer, webpack, dev }) => {
    // Disable filesystem cache in dev to avoid ENOENT on pack.gz (corruption when multiple processes or sync tools)
    if (dev) {
      config.cache = false;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack", // ← no require.resolve in ESM
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "preset-default", params: { overrides: { removeViewBox: false } } },
                { name: "removeDimensions", active: true },
              ],
            },
            titleProp: true,
          },
        },
      ],
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        __CEYLON_ROOTS__: JSON.stringify(true),
      })
    );

    if (isServer) {
      config.externals = config.externals || [];
    }

    return config;
  },
};

export default nextConfig;

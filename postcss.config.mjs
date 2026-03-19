// 🌿 Ceylon Roots — PostCSS Configuration
// -----------------------------------------------------
// Purpose:
//   Configure PostCSS to process TailwindCSS, autoprefix,
//   and handle modern CSS features in a stable way.
//
// Works with Next.js built-in PostCSS loader.
// -----------------------------------------------------

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // TailwindCSS (core utility framework)
    tailwindcss: {},

    // Adds vendor prefixes for browser compatibility
    autoprefixer: {},

    // Optional future-proof CSS features (uncomment if desired)
    // 'postcss-preset-env': {
    //   stage: 1,
    //   features: {
    //     'nesting-rules': true
    //   }
    // },
  },
};

export default config;

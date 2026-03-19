# ⚡ Ceylon Roots – Web Performance Budget

**Document version:** 1.0  
**Last updated:** October 2025  
**Maintained by:** Ceylon Roots Engineering & Digital Team  
**Compliance target:** Core Web Vitals (CWV) – Good Thresholds  

---

## 🧭 Purpose

This performance budget defines **quantitative limits** on what can be shipped to production.  
It ensures that the **Ceylon Roots website** remains fast, smooth, and sustainable — aligned with the brand’s commitment to quality and efficiency.

> _“Just as we craft the perfect cup of tea with precision, we measure and balance every byte that reaches our visitors.”_

---

## 🎯 Core Performance Goals

| Metric | Target | Description |
|--------|---------|-------------|
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | The main content (hero image or heading) should load within 2.5 seconds. |
| **FID (First Input Delay)** | ≤ 100ms | User interaction should feel instant. |
| **INP (Interaction to Next Paint)** | ≤ 200ms | Keeps all interactions responsive. |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | Prevents visible layout jumps. |
| **TTFB (Time to First Byte)** | ≤ 500ms | Ensures optimal server response time. |
| **Total Page Weight** | ≤ 1.2 MB | Includes HTML, CSS, JS, images, fonts, and third-party assets. |
| **Requests per Page** | ≤ 60 | Keep the number of network requests low. |
| **JavaScript Execution Time** | ≤ 2s on mid-tier devices | Reduces main thread blocking. |
| **Performance Score (Lighthouse)** | ≥ 90 | Maintain a high overall page performance score. |

---

## 📦 Asset Budgets

| Asset Type | Target Size (per page) | Notes |
|-------------|------------------------|-------|
| **HTML** | ≤ 50 KB | Keep templates clean, semantic, and server-rendered (Next.js). |
| **CSS (critical)** | ≤ 80 KB | Use Tailwind JIT and remove unused classes via Purge. |
| **JavaScript (total)** | ≤ 250 KB | Code-split and lazy-load non-critical scripts. |
| **Images (optimized)** | ≤ 700 KB | Use Next.js `<Image>` with AVIF/WebP. |
| **Fonts** | ≤ 100 KB | Host locally; use `display=swap`. |
| **Third-party scripts** | ≤ 100 KB | Only load essential analytics or embeds asynchronously. |

---

## 🧩 Component-Level Guidelines

### ✅ Hero Sections
- Limit hero images to **≤ 300 KB**.
- Use responsive sizes: `srcSet` and `sizes` attributes.
- Prefer **CSS gradients** and **SVGs** over raster graphics when possible.

### ✅ Animations & Video
- Loop videos in `.mp4` or `.webm` under **1 MB**.
- Always include `poster` image and `muted autoplay`.
- Support `prefers-reduced-motion`.

### ✅ Product Cards
- Compress product images to **≤ 120 KB** each.
- Use lazy loading for grids and carousels.
- Avoid runtime filters; use CSS or preprocessed images.

### ✅ Fonts
- Limit to **2 font families** (plus weights).
- Convert to `.woff2`.
- Use Tailwind utility classes instead of inline styles.

---

## 🧠 Build & Optimization Rules

1. **Use Next.js Image Optimization**  
   - Prefer AVIF/WebP.
   - Always define width, height, and quality.

2. **Tree Shaking & Dead Code Removal**  
   - Ensure only used components are bundled.
   - Remove console logs and debugging helpers in production.

3. **Static Generation (SSG)**  
   - Pre-render as many pages as possible for faster TTFB.

4. **Code Splitting**  
   - Dynamic imports for maps, videos, heavy animations, and admin panels.

5. **Caching Strategy**
   - Use immutable cache headers (`Cache-Control: public, max-age=31536000, immutable`).
   - Set up CDN edge caching for images and fonts.

6. **Lazy Loading**
   - Apply to offscreen images and videos.
   - Defer analytics scripts until after `DOMContentLoaded`.

7. **Minification & Compression**
   - Enable Brotli compression (`.br`) and fallback GZIP.
   - Minify CSS and JS via Vercel / Next.js build pipeline.

8. **Server Optimization**
   - Keep serverless cold starts < 500ms.
   - Use incremental static regeneration (ISR) for content updates.

---

## 🌐 Network & Global Delivery

| Region | Target Load Time | Hosting Node |
|--------|------------------|--------------|
| **Asia (Primary)** | ≤ 2.0s | Colombo / Singapore (Vercel Edge) |
| **Europe** | ≤ 2.3s | Frankfurt / London |
| **Middle East** | ≤ 2.5s | Dubai |
| **North America** | ≤ 2.8s | San Francisco / New York |
| **Oceania** | ≤ 3.0s | Sydney |

**CDN Provider:** Vercel Edge Network  
**Image CDN:** Next.js built-in Image Optimization  

---

## 🧪 Performance Testing Tools

| Tool | Use | Frequency |
|------|------|------------|
| **Lighthouse CI** | Automated scoring (Performance, SEO, A11y) | Every deployment |
| **WebPageTest** | Real-world load analysis | Monthly |
| **PageSpeed Insights** | Core Web Vitals verification | Weekly |
| **Chrome DevTools** | Local profiling | Ongoing |
| **Calibre / SpeedCurve** | Continuous monitoring | Quarterly |
| **Vercel Analytics** | Real-user performance metrics (RUM) | Always active |

---

## 📊 Example Lighthouse Target Thresholds

| Category | Minimum Score |
|-----------|----------------|
| **Performance** | 90 |
| **Accessibility** | 95 |
| **Best Practices** | 90 |
| **SEO** | 90 |
| **PWA (if applicable)** | 85 |

---

## 🧰 CI/CD Integration

- Integrate **Lighthouse CI** and **axe-core** in GitHub Actions.
- Reject pull requests if:
  - Page weight > 1.2 MB  
  - Lighthouse Performance < 90  
  - Accessibility < 95  
  - Any Core Web Vital “Needs Improvement”

Example `.github/workflows/perf.yml` snippet:
```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: 'https://ceylonroots.com'
    budgetPath: './docs/performance-budget.md'
    uploadArtifacts: true
    temporaryPublicStorage: true

# 🌿 Ceylon Roots – Accessibility Checklist

**Document version:** 1.0  
**Last updated:** October 2025  
**Compliance target:** WCAG 2.1 Level AA  
**Maintained by:** Ceylon Roots Digital Team  

---

## 🧭 Overview

Ceylon Roots is committed to creating an inclusive, accessible, and enjoyable experience for every visitor — regardless of ability, device, or environment.  
This checklist ensures that every page, component, and piece of content aligns with accessibility best practices.

---

## 🎨 Design & Visual Guidelines

### ✅ Color & Contrast
- [ ] Minimum contrast ratio **4.5:1** for text and background.  
- [ ] Large text (18pt+ or bold 14pt) has a minimum contrast of **3:1**.  
- [ ] Never rely on color alone to convey information (e.g., errors, status).  
- [ ] Use accessible brand palette (`emerald`, `neutral`, `amber`, `rose`) verified with [Contrast Checker](https://contrast-ratio.com/).  

### ✅ Typography
- [ ] Use scalable, legible fonts with a minimum body size of **16px**.  
- [ ] Maintain consistent line height (1.5–1.75) for readability.  
- [ ] Avoid text embedded in images; use real text wherever possible.  
- [ ] Ensure clear focus and reading order in multi-language sections.  

### ✅ Layout & Spacing
- [ ] Maintain at least **8px grid spacing** between interactive elements.  
- [ ] Support zoom up to **200%** without loss of content or functionality.  
- [ ] Responsive breakpoints must preserve logical reading flow.  

---

## ⌨️ Keyboard Accessibility

- [ ] All elements are fully navigable via **keyboard only** (`Tab`, `Shift + Tab`, `Enter`, `Space`, `Arrow keys`).  
- [ ] No keyboard traps — users can always move forward and backward.  
- [ ] Use `:focus-visible` and visible focus rings (`outline` or `ring-2`) for all interactive components.  
- [ ] Dropdowns, modals, and accordions close with `Esc`.  
- [ ] Ensure logical tab order follows DOM structure.

---

## 🗣️ Screen Reader Compatibility

- [ ] Use semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<footer>`).  
- [ ] Provide descriptive `aria-labels` and roles for icons, buttons, and landmarks.  
- [ ] Every image has meaningful `alt` text — or `alt=""` if decorative.  
- [ ] Use `aria-expanded`, `aria-controls`, and `aria-live` for dynamic components (accordions, modals, toasts, etc.).  
- [ ] Skip navigation link (`Skip to main content`) is available and visible on focus.  
- [ ] Ensure screen readers correctly announce page titles and section headings.

---

## 🔊 Media & Animations

- [ ] All video or audio content includes **captions** or **transcripts**.  
- [ ] Auto-playing media is disabled or can be paused/stopped.  
- [ ] Avoid flashing content (no more than 3 flashes per second).  
- [ ] Use `prefers-reduced-motion` to respect user OS settings.  
- [ ] Add `aria-hidden="true"` to purely decorative animations.  

---

## 🧩 Component Accessibility (React + Next.js)

| Component | Accessibility Features | Checklist |
|------------|------------------------|------------|
| **Button** | Keyboard focus, ARIA roles, disabled states | [x] |
| **Card** | Semantic heading hierarchy | [x] |
| **Accordion** | `aria-expanded`, `aria-controls`, focusable triggers | [x] |
| **KPI** | Proper heading and descriptive labels | [x] |
| **Marquee** | `aria-label` for moving content and `prefers-reduced-motion` support | [x] |
| **Forms** | Labeled inputs, validation messages announced via `aria-live` | [x] |
| **Video Loop** | `muted`, `playsInline`, `alt poster`, and pause on off-screen | [x] |
| **Map / Globe** | Provide fallback static image or link for non-interactive environments | [x] |

---

## 🧱 Content & Language

- [ ] The document `<html>` includes `lang="en"`.  
- [ ] Provide consistent heading hierarchy (H1 → H2 → H3).  
- [ ] Avoid jargon and use plain, concise English.  
- [ ] Use descriptive link text instead of “Click here” or “Read more.”  
- [ ] Define abbreviations and acronyms at first mention (e.g., “HACCP — Hazard Analysis and Critical Control Points”).  
- [ ] Ensure consistent tone that matches Ceylon Roots’ professional brand identity.

---

## 🧾 Forms & Inputs

- [ ] Each input has an associated `<label>` or `aria-label`.  
- [ ] Required fields are indicated using both color **and** text (“Required”).  
- [ ] Validation errors are announced to screen readers (`aria-live="assertive"`).  
- [ ] Placeholder text is not used as a label substitute.  
- [ ] Submit buttons have descriptive text (e.g., “Send Message”).  
- [ ] Keyboard and mobile input types are appropriate (`email`, `tel`, etc.).  

---

## 🌍 Internationalization

- [ ] English content is fully translatable and follows `i18n` structure.  
- [ ] Avoid embedding hardcoded strings in components — use dictionary or localization files.  
- [ ] Support UTF-8 encoding for Sinhala, Tamil, and other languages if localized in future.  

---

## 📱 Mobile & Touch Interactions

- [ ] Interactive elements are at least **44x44px**.  
- [ ] Touch targets have adequate spacing to prevent accidental taps.  
- [ ] No horizontal scrolling required on small screens.  
- [ ] Mobile gestures are optional, not mandatory (e.g., swipes).  
- [ ] Ensure all hover effects are replicated by focus or click events.  

---

## 🔒 Performance & Accessibility Together

- [ ] Use optimized images with `alt` text and `loading="lazy"`.  
- [ ] Include meaningful titles and meta descriptions for SEO + accessibility synergy.  
- [ ] Ensure Lighthouse accessibility score ≥ **95** on all pages.  
- [ ] Run automated audits with **axe-core**, **Lighthouse**, and **Pa11y CI** in CI/CD.  

---

## 🧰 Tools & Testing Resources

| Category | Tool | Purpose |
|-----------|------|----------|
| **Browser Extension** | [axe DevTools](https://www.deque.com/axe/devtools/) | Automated accessibility scanning |
| **Screen Reader** | NVDA (Windows), VoiceOver (macOS) | Manual testing |
| **Color Contrast** | [Contrast Checker](https://contrast-ratio.com/) | Verify text contrast |
| **Validation** | [WAVE Web Accessibility Tool](https://wave.webaim.org/) | Visual inspection |
| **Performance + A11y** | Lighthouse | Automated scoring and checks |
| **Keyboard Testing** | Chrome / Firefox | Ensure full tab navigation |

---

## ✅ Final Review Before Launch

- [ ] No console errors or missing `alt` attributes.  
- [ ] Skip link visible and working.  
- [ ] All interactive elements accessible via keyboard.  
- [ ] All videos/images have accessible descriptions.  
- [ ] Sufficient contrast verified in dark mode.  
- [ ] Screen reader correctly announces page titles and focus.  
- [ ] Lighthouse accessibility score: **≥ 95/100**  

---

### 🏁 Accessibility Commitment

> **Ceylon Roots** is dedicated to maintaining the highest accessibility and ethical standards across its digital presence.  
> Our mission is to ensure that the beauty and heritage of **Pure Ceylon Tea** can be experienced by everyone, everywhere.

---

**Document maintained by:**  
Ceylon Roots Digital Team  
📧 [web@ceylonroots.com](mailto:web@ceylonroots.com)  
🌐 [www.ceylonroots.com](https://www.ceylonroots.com)

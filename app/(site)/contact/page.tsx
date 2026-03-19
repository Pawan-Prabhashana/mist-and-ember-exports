"use client";

import { useState } from "react";

/** Badge image that never 404s: tries PNG → SVG → inline data URI */
function BadgeImg({
  base, // e.g. "/images/certifications/iso22000" (NO extension)
  label,
  className,
}: {
  base: string;
  label: string;
  className?: string;
}) {
  const fallbackDataUri =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='60' viewBox='0 0 200 60'>
        <rect rx='10' ry='10' width='200' height='60' fill='#F6F3EE' stroke='#083335' stroke-width='2'/>
        <text x='100' y='36' text-anchor='middle' font-family='sans-serif' font-size='14' fill='#083335'>${label}</text>
      </svg>`
    );

  const [src, setSrc] = useState<string>(`${base}.png`);
  const [triedSvg, setTriedSvg] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${label} logo`}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!triedSvg) {
          setTriedSvg(true);
          setSrc(`${base}.svg`);
        } else {
          setSrc(fallbackDataUri);
        }
      }}
    />
  );
}

/** Google Map with graceful fallback (no broken image box) */
function MapEmbed({
  query = "Colombo, Sri Lanka",
  height = 320,
}: {
  query?: string;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl shadow-lg relative" style={{ height }}>
      {/* Fallback shown until iframe loads (and if it never loads) */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EEE]">
          <div className="text-[#083335] font-medium">Map preview unavailable</div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center rounded-lg border border-[#083335] px-4 py-2 text-sm text-[#083335] hover:bg-[#083335] hover:text-white"
          >
            Open in Google Maps
          </a>
        </div>
      )}

      <iframe
        title="Mist & Ember Exports Location"
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "error">(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSent(null);
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed: ${res.status}`);
      }
      setSent("ok");
      form.reset();
    } catch (err: any) {
      setSent("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Hero (CSS gradient only) */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-10"
          style={{
            background:
              "linear-gradient(135deg,#f1e9db 0%, #e7decc 50%, #d6e1d7 100%)",
          }}
        />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">Contact Us</h1>
          <p className="mt-4 text-[#4B5A56] md:text-lg">
            Tell us what you’re looking for — our exports team will get back to you within
            one business day.
          </p>
        </div>
      </section>

      {/* Grid: Form + Info */}
      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
          {/* Form Card */}
          <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Send an Enquiry</h2>
            <p className="mt-2 text-sm text-[#4B5A56]">
              Fields marked with <span aria-hidden>*</span>
              <span className="sr-only">required</span> are required.
            </p>

            {sent === "ok" && (
              <div
                role="status"
                className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-800"
              >
                Thank you — your message has been sent. Our team will reply shortly.
              </div>
            )}
            {sent === "error" && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800"
              >
                Couldn’t send your message. {errorMsg}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none ring-0 transition focus:border-[#C4A36A] focus:shadow-sm"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
                  placeholder="Company name"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
                    placeholder="+94 7X XXX XXXX"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
                    placeholder="e.g., Sri Lanka"
                  />
                </div>
                <div>
                  <label htmlFor="product" className="block text-sm font-medium">
                    Product of Interest *
                  </label>
                  <select
                    id="product"
                    name="product"
                    required
                    className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a product
                    </option>
                    <option value="tea">Ceylon Tea</option>
                    <option value="cinnamon">Ceylon Cinnamon</option>
                    <option value="coconut">Coconut Products</option>
                    <option value="other">Other Spices / Herbs</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium">
                  Quantity / Order Size
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
                  placeholder="e.g., 5 MT per month"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text sm font-medium">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-4 py-3 outline-none transition focus:border-[#C4A36A] focus:shadow-sm"
                  placeholder="Tell us about specs, grades, packaging, delivery terms, etc."
                />
              </div>

              <div>
                <label htmlFor="attachment" className="block text-sm font-medium">
                  Attachment (optional)
                </label>
                <input
                  id="attachment"
                  name="attachment"
                  type="file"
                  className="mt-2 w-full rounded-xl border border-[#E7E3DE] bg-white px-2 py-2 file:mr-4 file:rounded-lg file:border-0 file:bg-[#083335] file:px-4 file:py-2 file:text-white hover:file:opacity-90"
                />
                <p className="mt-1 text-xs text-[#4B5A56]">
                  You can attach specs or packaging references (PDF, JPG, PNG).
                </p>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-[#083335] px-5 py-3 text-white transition hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>

                <a
                  href="https://wa.me/94700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#083335] px-5 py-3 text-[#083335] transition hover:bg-[#083335] hover:text-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0C5.43 0 .06 5.37.06 11.98c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62a12 12 0 0 0 5.84 1.49h.01c6.62 0 12-5.37 12-11.98a11.86 11.86 0 0 0-3.53-8.41ZM12.05 22a9.94 9.94 0 0 1-5.06-1.39l-.36-.21-3.68.96.98-3.58-.23-.37a10.02 10.02 0 1 1 8.35 4.59Zm5.48-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.46-.15-.66.15-.19.29-.76.96-.93 1.15-.17.2-.34.22-.64.07c-.3-.15-1.25-.46-2.38-1.47c-.88-.78-1.48-1.74-1.65-2.03c-.17-.29-.02-.45.13-.6c.13-.13.3-.34.45-.51c.15-.17.2-.29.3-.49c.1-.2.05-.37-.02-.52c-.07-.15-.66-1.59-.9-2.18c-.24-.58-.48-.5-.66-.5h-.57c-.2 0-.52.08-.8.37c-.27.29-1.04 1.02-1.04 2.48c0 1.45 1.07 2.85 1.23 3.05c.15.2 2.1 3.2 5.08 4.49c.71.31 1.26.49 1.69.63c.71.23 1.36.2 1.87.12c.57-.08 1.77-.72 2.02-1.42c.25-.7.25-1.3.17-1.42c-.08-.12-.28-.2-.58-.35Z"
                    />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </form>
          </div>

          {/* Info + Map */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="font-serif text-xl md:text-2xl font-semibold">Contact Details</h3>
              <dl className="mt-4 space-y-3 text-sm text-[#4B5A56]">
                <div>
                  <dt className="font-medium text-[#083335]">Head Office</dt>
                  <dd>Colombo, Sri Lanka</dd>
                </div>
                <div>
                  <dt className="font-medium text-[#083335]">Email</dt>
                  <dd>
                    <a className="underline hover:no-underline" href="mailto:hello@mistandemberexports.com">
                      hello@mistandemberexports.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[#083335]">Phone</dt>
                  <dd>
                    <a className="underline hover:no-underline" href="tel:+94718159949">+94 71 815 9949</a>
                    {" · "}
                    <a className="underline hover:no-underline" href="tel:+94703203060">+94 70 320 3060</a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[#083335]">Business Hours</dt>
                  <dd>Mon–Fri, 9:00–17:30 (GMT+5:30)</dd>
                </div>
              </dl>
            </div>

            {/* Map with graceful fallback */}
            <MapEmbed query="Colombo, Sri Lanka" height={320} />

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="font-serif text-xl md:text-2xl font-semibold">Certifications</h3>
              <div className="mt-4 flex flex-wrap items-center gap-5">
                {[
                  { key: "iso22000", label: "ISO 22000" },
                  { key: "haccp", label: "HACCP" },
                  { key: "fairtrade", label: "Fairtrade" },
                  { key: "organic", label: "Organic" },
                ].map((b) => (
                  <BadgeImg
                    key={b.key}
                    base={`/images/certifications/${b.key}`}
                    label={b.label}
                    className="h-10 w-auto opacity-90"
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-[#4B5A56]">
                We try PNG → SVG → a neutral inline badge, so the page never breaks even if files are missing.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

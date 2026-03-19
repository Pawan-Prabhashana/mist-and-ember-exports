import Link from "next/link";

export const metadata = {
  title: "Terms of Use — Mist & Ember Exports",
  description:
    "Review the Terms of Use that govern access to and use of the Mist & Ember Exports website and services.",
};

const LAST_UPDATED = "October 20, 2025";

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-20 border-b border-[#E7E3DE]">
        <div className="max-w-5xl">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
            Terms of Use
          </h1>
          <p className="mt-4 text-[#4B5A56]">
            These Terms of Use (“Terms”) govern your access to and use of the Mist & Ember Exports
            website and related services. By using this website, you agree to comply with and
            be bound by these Terms.
          </p>
          <p className="mt-2 text-sm text-[#4B5A56]">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)] max-w-6xl">
          {/* TOC */}
          <aside className="order-2 lg:order-1">
            <nav
              aria-label="Table of contents"
              className="sticky top-6 rounded-2xl bg-white/70 backdrop-blur border border-[#E7E3DE] p-4 shadow-sm"
            >
              <p className="text-sm font-semibold tracking-wide uppercase text-[#4B5A56]">
                Contents
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  ["1. Acceptance of terms", "acceptance"],
                  ["2. About Mist & Ember Exports", "about"],
                  ["3. Eligibility", "eligibility"],
                  ["4. Permitted use", "permitted"],
                  ["5. Intellectual property", "ip"],
                  ["6. Product information", "products"],
                  ["7. Third-party links", "third-party"],
                  ["8. Disclaimer of warranties", "disclaimer"],
                  ["9. Limitation of liability", "liability"],
                  ["10. Indemnification", "indemnification"],
                  ["11. Governing law & jurisdiction", "law"],
                  ["12. Changes to terms", "changes"],
                  ["13. Contact us", "contact"],
                ].map(([label, id]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="hover:text-[#B07C4F] transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main text */}
          <article className="order-1 lg:order-2 space-y-10">
            {/* 1 */}
            <section id="acceptance" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                By accessing or using our website, you agree to comply with these Terms and
                our{" "}
                <Link href="/legal/privacy" className="underline text-[#B07C4F]">
                  Privacy Policy
                </Link>
                . If you do not agree, please discontinue use immediately.
              </p>
            </section>

            {/* 2 */}
            <section id="about" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                2. About Mist & Ember Exports
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                Mist & Ember Exports is a Sri Lankan export company specializing in authentic Ceylon
                products including tea, cinnamon, coconut, and spices. The website is intended
                for business and informational purposes related to our export operations.
              </p>
            </section>

            {/* 3 */}
            <section id="eligibility" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">3. Eligibility</h2>
              <p className="mt-3 text-[#4B5A56]">
                You must be at least 18 years old or have legal capacity to enter binding
                agreements to use this site. By accessing our Services, you confirm that you
                meet these requirements.
              </p>
            </section>

            {/* 4 */}
            <section id="permitted" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">4. Permitted Use</h2>
              <p className="mt-3 text-[#4B5A56]">
                You agree to use the website only for lawful purposes and in accordance with
                these Terms. You shall not:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-[#4B5A56]">
                <li>Use the site to transmit malicious code or harmful content.</li>
                <li>Attempt to gain unauthorized access to servers or data.</li>
                <li>Use the site for fraudulent, misleading, or illegal activities.</li>
                <li>Copy, scrape, or reuse content without written permission.</li>
              </ul>
            </section>

            {/* 5 */}
            <section id="ip" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                5. Intellectual Property
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                All text, graphics, logos, product names, and other materials on this website
                are owned by or licensed to Mist & Ember Exports. You may view and print pages for
                personal or internal business use only. Any reproduction, distribution, or
                derivative work without prior written consent is prohibited.
              </p>
            </section>

            {/* 6 */}
            <section id="products" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                6. Product Information & Availability
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                Product details, images, and specifications are provided for general
                informational purposes. Actual product qualities or packaging may vary.
                Availability is subject to change without notice.
              </p>
              <p className="mt-3 text-[#4B5A56]">
                All export transactions are governed by separate contractual terms negotiated
                between Mist & Ember Exports and the respective buyer.
              </p>
            </section>

            {/* 7 */}
            <section id="third-party" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">7. Third-Party Links</h2>
              <p className="mt-3 text-[#4B5A56]">
                The website may contain links to third-party sites or services. Mist & Ember Exports is
                not responsible for their content, policies, or availability. You access such
                sites at your own risk.
              </p>
            </section>

            {/* 8 */}
            <section id="disclaimer" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                8. Disclaimer of Warranties
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                The website and its contents are provided “as is” without warranties of any
                kind, either express or implied, including but not limited to warranties of
                merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            {/* 9 */}
            <section id="liability" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                9. Limitation of Liability
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                To the fullest extent permitted by law, Mist & Ember Exports and its affiliates shall
                not be liable for any indirect, incidental, consequential, or punitive damages
                arising from your use of or inability to use the website or Services.
              </p>
            </section>

            {/* 10 */}
            <section id="indemnification" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                10. Indemnification
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                You agree to indemnify and hold harmless Mist & Ember Exports, its directors, employees,
                and partners from any claims, damages, or losses arising from your breach of
                these Terms or misuse of the website.
              </p>
            </section>

            {/* 11 */}
            <section id="law" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                11. Governing Law & Jurisdiction
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                These Terms are governed by the laws of the Democratic Socialist Republic of Sri
                Lanka. Any disputes shall be subject to the exclusive jurisdiction of the courts
                of Colombo, Sri Lanka.
              </p>
            </section>

            {/* 12 */}
            <section id="changes" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                12. Changes to Terms
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                Mist & Ember Exports may revise these Terms from time to time. Updated versions will be
                posted on this page with a new “Last updated” date. Continued use of the website
                after such changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            {/* 13 */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">13. Contact Us</h2>
              <p className="mt-3 text-[#4B5A56]">
                For questions about these Terms, please contact:
              </p>
              <address className="not-italic mt-3 rounded-2xl bg-white p-5 border border-[#E7E3DE] shadow-sm">
                <div className="font-semibold">Mist & Ember Exports</div>
                <div>Colombo, Sri Lanka</div>
                <div className="mt-1">
                  Email:{" "}
                  <a className="underline" href="mailto:legal@mistandember.com">
                    legal@mistandember.com
                  </a>
                </div>
                <div>
                  Phone:{" "}
                  <a className="underline" href="tel:+94700000000">
                    +94 70 000 0000
                  </a>
                </div>
              </address>
              <p className="mt-4 text-sm text-[#4B5A56]">
                For privacy-related matters, please refer to our{" "}
                <Link href="/legal/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}

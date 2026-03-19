import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Mist & Ember Exports",
  description:
    "Learn how Mist & Ember Exports collects, uses, and protects your personal information across our website and services.",
};

const LAST_UPDATED = "October 20, 2025";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EE] text-[#083335]">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-20 border-b border-[#E7E3DE]">
        <div className="max-w-5xl">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[#4B5A56]">
            This Privacy Policy explains how Mist & Ember Exports (“we”, “our”, “us”) collects, uses,
            discloses, and safeguards personal information when you visit{" "}
            <span className="underline decoration-[#C4A36A]/60">mistandember.com</span> or
            interact with our services.
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
                  ["1. Who we are", "who-we-are"],
                  ["2. Information we collect", "info-we-collect"],
                  ["3. How we use information", "how-we-use"],
                  ["4. Legal bases (GDPR)", "legal-bases"],
                  ["5. Cookies & tracking", "cookies"],
                  ["6. Sharing & disclosures", "sharing"],
                  ["7. Data retention", "retention"],
                  ["8. International transfers", "transfers"],
                  ["9. Your rights", "your-rights"],
                  ["10. Security", "security"],
                  ["11. Children’s privacy", "children"],
                  ["12. Third-party links", "third-party"],
                  ["13. Changes to this policy", "changes"],
                  ["14. Contact us", "contact"],
                ].map(([label, id]) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="hover:text-[#B07C4F] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main policy */}
          <article className="order-1 lg:order-2 space-y-10">
            {/* 1 */}
            <section id="who-we-are" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">1. Who we are</h2>
              <p className="mt-3 text-[#4B5A56]">
                Mist & Ember Exports is a Sri Lankan export company specializing in authentic Ceylon tea,
                cinnamon, coconut, and other local products. References to “Services” include our
                website, contact forms, and related communications.
              </p>
            </section>

            {/* 2 */}
            <section id="info-we-collect" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                2. Information we collect
              </h2>
              <div className="mt-3 space-y-4 text-[#4B5A56]">
                <div>
                  <h3 className="font-semibold">Information you provide</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Contact details (name, email, phone, company, country).</li>
                    <li>
                      Enquiry data (product interest, quantity, specifications, attachments).
                    </li>
                    <li>Communications with our team (emails, messages, call notes).</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Information we collect automatically</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Usage data (pages visited, referring/exit pages, timestamps, clickstream).
                    </li>
                    <li>
                      Device/technical data (IP address, browser type, language, screen size).
                    </li>
                    <li>Approximate location based on IP.</li>
                    <li>Cookies and similar technologies (see Section 5).</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Information from third parties</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Analytics providers and ad networks (aggregated usage insights).</li>
                    <li>Logistics partners (shipment and compliance information).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3 */}
            <section id="how-we-use" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                3. How we use information
              </h2>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-[#4B5A56]">
                <li>Respond to enquiries and provide quotations or proposals.</li>
                <li>Process, fulfill, and manage export orders and customer relationships.</li>
                <li>Operate, maintain, and improve the website and Services.</li>
                <li>Ensure quality, safety, compliance, and traceability.</li>
                <li>Communicate updates, notices, or changes to our Services or policies.</li>
                <li>Detect, prevent, and address fraud, security, or technical issues.</li>
              </ul>
            </section>

            {/* 4 */}
            <section id="legal-bases" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                4. Legal bases for processing (GDPR)
              </h2>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-[#4B5A56]">
                <li><span className="font-semibold">Consent</span> (e.g., marketing emails).</li>
                <li>
                  <span className="font-semibold">Contract</span> (to respond to enquiries or
                  deliver requested Services).
                </li>
                <li>
                  <span className="font-semibold">Legitimate Interests</span> (website operations,
                  analytics, security).
                </li>
                <li>
                  <span className="font-semibold">Legal Obligations</span> (tax, customs, compliance).
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section id="cookies" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                5. Cookies & tracking technologies
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                We use cookies and similar technologies (e.g., pixels, local storage) to operate the
                site, remember preferences, understand usage, and measure performance.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-[#4B5A56]">
                <li>Strictly necessary: site security, core functionality.</li>
                <li>Performance/analytics: aggregated traffic and usage patterns.</li>
                <li>Functional: remembering user preferences.</li>
              </ul>
              <p className="mt-3 text-[#4B5A56]">
                You can control cookies via your browser settings. Some features may not function
                properly without certain cookies.
              </p>
            </section>

            {/* 6 */}
            <section id="sharing" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                6. Sharing & disclosures
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                We do not sell personal data. We may share information with:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-[#4B5A56]">
                <li>Service providers (hosting, analytics, email, logistics, QA labs).</li>
                <li>Professional advisors (legal, accounting, compliance).</li>
                <li>Authorities where required by law or to protect our rights and safety.</li>
                <li>
                  Business transfers in connection with a merger, acquisition, or asset sale.
                </li>
              </ul>
            </section>

            {/* 7 */}
            <section id="retention" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">7. Data retention</h2>
              <p className="mt-3 text-[#4B5A56]">
                We keep personal data only as long as necessary for the purposes described in this
                policy, to comply with legal obligations, resolve disputes, and enforce agreements.
                Retention periods vary by data type and context (e.g., enquiry records vs.
                compliance documentation).
              </p>
            </section>

            {/* 8 */}
            <section id="transfers" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                8. International transfers
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                We operate globally. When transferring personal data internationally, we use
                appropriate safeguards (such as contractual clauses) in accordance with applicable
                laws.
              </p>
            </section>

            {/* 9 */}
            <section id="your-rights" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">9. Your rights</h2>
              <p className="mt-3 text-[#4B5A56]">
                Subject to local laws, you may have rights to access, correct, delete, or restrict
                the processing of your personal information; to object to processing; to data
                portability; and to withdraw consent at any time.
              </p>
              <p className="mt-2 text-[#4B5A56]">
                To exercise these rights, contact us at{" "}
                <a className="underline" href="mailto:privacy@mistandember.com">
                  privacy@mistandember.com
                </a>
                . We may need to verify your identity before responding.
              </p>
            </section>

            {/* 10 */}
            <section id="security" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">10. Security</h2>
              <p className="mt-3 text-[#4B5A56]">
                We implement administrative, technical, and physical safeguards designed to protect
                personal data. However, no method of transmission or storage is completely secure.
              </p>
            </section>

            {/* 11 */}
            <section id="children" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                11. Children’s privacy
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                Our website and Services are not directed to children under the age of 16, and we do
                not knowingly collect personal information from children.
              </p>
            </section>

            {/* 12 */}
            <section id="third-party" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                12. Third-party links
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                Our website may contain links to third-party sites or services that we do not
                control. We are not responsible for their content or privacy practices.
              </p>
            </section>

            {/* 13 */}
            <section id="changes" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                13. Changes to this policy
              </h2>
              <p className="mt-3 text-[#4B5A56]">
                We may update this Privacy Policy from time to time. The “Last updated” date at the
                top indicates the latest revision. Significant changes will be communicated where
                required by law.
              </p>
            </section>

            {/* 14 */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">14. Contact us</h2>
              <p className="mt-3 text-[#4B5A56]">
                If you have questions about this policy or our privacy practices, please contact:
              </p>
              <address className="not-italic mt-3 rounded-2xl bg-white p-5 border border-[#E7E3DE] shadow-sm">
                <div className="font-semibold">Mist & Ember Exports</div>
                <div>Colombo, Sri Lanka</div>
                <div className="mt-1">
                  Email:{" "}
                  <a className="underline" href="mailto:privacy@mistandember.com">
                    privacy@mistandember.com
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
                For general site information, see our{" "}
                <Link className="underline" href="/legal/terms">
                  Terms of Use
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

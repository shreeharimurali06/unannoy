import type { Metadata } from "next";

const updated = "May 16, 2026";
const email = "contact@unannoy.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Unannoy handles local browser tools, preferences, analytics, advertising, and user input.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 leading-7 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Privacy Policy</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-muted">Last updated: {updated}</p>

      <div className="mt-8 space-y-8 text-muted">
        <section>
          <p>Welcome to Unannoy. We make tiny browser tools for wildly annoying tasks.</p>
          <p className="mt-3">
            This Privacy Policy explains what we collect, what we do not collect, and how we try to keep things simple.
          </p>
        </section>

        <PolicySection title="The short version">
          <p>Most Unannoy tools run directly in your browser.</p>
          <p>
            That means when you paste text into tools like Text Cleaner, Word Counter, Case Converter, JSON Formatter,
            XML Formatter, or Markdown Viewer, the processing happens on your device whenever possible.
          </p>
          <p>We do not intentionally store your pasted text, files, tool inputs, or tool outputs on our servers.</p>
          <p>No account is required to use Unannoy.</p>
        </PolicySection>

        <PolicySection title="Information you provide">
          <p>You may enter text, links, code, Markdown, JSON, XML, or other content into Unannoy tools.</p>
          <p>
            For local browser-based tools, this content is processed in your browser and is not intentionally sent to
            our servers.
          </p>
          <p>Please avoid pasting highly sensitive information into any online tool, including Unannoy.</p>
        </PolicySection>

        <PolicySection title="Local storage">
          <p>Unannoy may use your browser&apos;s localStorage to remember simple preferences, such as:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>light or dark mode</li>
            <li>selected tool options</li>
            <li>reading speed preference</li>
            <li>recently used settings</li>
          </ul>
          <p className="mt-3">This information stays in your browser unless you clear it.</p>
          <p>We do not use localStorage to intentionally store your tool content unless a specific feature clearly says so.</p>
        </PolicySection>

        <PolicySection title="Analytics">
          <p>
            We may use privacy-conscious analytics or standard website analytics to understand how people use Unannoy.
          </p>
          <p className="mt-3">Analytics may include information such as pages visited, tool used, device type, browser type, approximate location based on IP, referral source, and interaction events such as clicking a copy button.</p>
          <p className="mt-3">
            We do not intentionally send your pasted text, files, input content, or output content to analytics. For
            example, we may track that the Text Cleaner was used, but not the text you cleaned.
          </p>
        </PolicySection>

        <PolicySection title="Advertising">
          <p>
            Unannoy may display ads in the future, including ads served by Google AdSense or similar advertising
            partners.
          </p>
          <p>
            Advertising partners may use cookies or similar technologies to show ads, measure ad performance, prevent
            fraud, and improve ad relevance.
          </p>
          <p>Google and its partners may use cookies to serve ads based on your visits to this and other websites.</p>
          <p>
            Learn more at{" "}
            <a className="text-primary underline" href="https://policies.google.com/technologies/partner-sites">
              Google partner sites
            </a>{" "}
            and manage personalization at{" "}
            <a className="text-primary underline" href="https://adssettings.google.com/">
              Google Ads Settings
            </a>.
          </p>
        </PolicySection>

        <PolicySection title="Cookies">
          <p>
            Unannoy may use cookies or similar technologies for analytics, advertising, remembering preferences, and
            improving site performance.
          </p>
          <p>You can disable cookies in your browser settings, but some features may not work as expected.</p>
        </PolicySection>

        <PolicySection title="Third-party services">
          <p>
            Unannoy may use third-party services for hosting, analytics, error monitoring, advertising, and performance
            measurement. These services may process limited technical information according to their own privacy policies.
          </p>
        </PolicySection>

        <PolicySection title="File and image tools">
          <p>
            Some future Unannoy tools may allow you to open or process files, images, PDFs, or other documents. Where
            possible, we aim to process files locally in your browser.
          </p>
          <p>If a tool ever requires uploading data to a server, the tool page will clearly say so.</p>
        </PolicySection>

        <PolicySection title="Children's privacy">
          <p>Unannoy is a general utility website and is not directed at children under 13.</p>
          <p>We do not knowingly collect personal information from children.</p>
        </PolicySection>

        <PolicySection title="Data security">
          <p>
            We try to keep Unannoy simple and privacy-friendly by avoiding accounts, databases, and unnecessary storage.
            However, no website or internet transmission is perfectly secure.
          </p>
          <p>
            Please do not paste passwords, private keys, financial information, medical records, or other highly
            sensitive content into online tools.
          </p>
        </PolicySection>

        <PolicySection title="Changes to this policy">
          <p>We may update this Privacy Policy from time to time.</p>
          <p>When we do, we will update the Last updated date at the top of this page.</p>
        </PolicySection>

        <PolicySection title="Contact">
          <p>If you have questions about this Privacy Policy, contact us at:</p>
          <p>
            <a className="font-medium text-primary underline" href={`mailto:${email}`}>
              {email}
            </a>
          </p>
        </PolicySection>
      </div>
    </article>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

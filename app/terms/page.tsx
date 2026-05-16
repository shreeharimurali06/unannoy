import type { Metadata } from "next";

const updated = "May 16, 2026";
const email = "contact@unannoy.com";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for Unannoy, a local-first utility website for tiny digital tasks.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 leading-7 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Terms of Use</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Terms of Use</h1>
      <p className="mt-4 text-muted">Last updated: {updated}</p>

      <div className="mt-8 space-y-8 text-muted">
        <section>
          <p>Welcome to Unannoy.</p>
          <p className="mt-3">
            Unannoy provides tiny browser tools for wildly annoying tasks. By using this website, you agree to these
            Terms of Use. If you do not agree, please do not use the website.
          </p>
        </section>
        {[
          ["What Unannoy does", "Unannoy offers simple tools for tasks such as cleaning text, counting words and characters, formatting text, viewing Markdown, formatting JSON or XML, cleaning links, and converting or processing small files where available. Most tools are designed to run in your browser."],
          ["Use at your own risk", "Unannoy is provided for convenience. We try to make the tools accurate and useful, but we do not guarantee that every result will be perfect, complete, or suitable for your specific purpose. You are responsible for checking outputs before using them in important work."],
          ["No professional advice", "Unannoy does not provide legal, financial, medical, tax, security, or professional advice. Any information on the website is for general utility and informational purposes only."],
          ["Your content", "You are responsible for the content you paste, type, upload, or process using Unannoy. Please do not use Unannoy to process content that is illegal, harmful, abusive, infringing, or violates someone else's rights. For local browser-based tools, your content is processed on your device whenever possible and is not intentionally stored by us."],
          ["Sensitive information", "Please do not paste or upload highly sensitive information, such as passwords, private keys, confidential business documents, financial information, medical information, government identification numbers, or personal data you do not have permission to process. Even though Unannoy is designed to be privacy-friendly, no online tool should be treated as a secure vault."],
          ["Acceptable use", "You agree not to misuse or overload the website, attempt to break or attack it, use it for illegal purposes, use automated systems to abuse the service, interfere with ads, analytics, or security systems, or copy the website design, branding, or content in a way that violates our rights."],
          ["Ads and third-party links", "Unannoy may show ads or link to third-party websites. We are not responsible for the content, privacy practices, products, or services of third-party websites. Clicking third-party links or ads is at your own discretion."],
          ["Availability", "We may update, change, remove, or discontinue any tool or page at any time. We do not guarantee that Unannoy will always be available, error-free, or uninterrupted."],
          ["Intellectual property", "The Unannoy name, branding, design, text, and website experience belong to Unannoy unless otherwise stated. You may use the tools for personal or work purposes, but you may not copy, resell, or redistribute the website itself without permission."],
          ["Disclaimer of warranties", "Unannoy is provided as is and as available. We make no warranties, express or implied, about the website, tools, outputs, availability, accuracy, or fitness for a particular purpose."],
          ["Limitation of liability", "To the maximum extent allowed by law, Unannoy and its owners will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, business, or goodwill arising from your use of the website."],
          ["Changes to these terms", "We may update these Terms of Use from time to time. When we do, we will update the Last updated date at the top of this page."],
        ].map(([title, body]) => (
          <section key={title}>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-3">{body}</p>
          </section>
        ))}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Contact</h2>
          <p className="mt-3">If you have questions about these Terms, contact us at:</p>
          <a className="font-medium text-primary underline" href={`mailto:${email}`}>
            {email}
          </a>
        </section>
      </div>
    </article>
  );
}

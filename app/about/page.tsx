import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Unannoy, a collection of tiny tools for wildly annoying tasks.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">About Unannoy</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Tiny tools for wildly annoying tasks.</h1>
      <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
        <p>Unannoy is a collection of tiny tools for wildly annoying tasks.</p>
        <p>
          It exists because small digital chores should not require ugly websites, sign-ups, popups, or unnecessary
          uploads.
        </p>
        <p>
          Need to clean messy copied text? Count words? Format JSON? Preview Markdown? Remove duplicate lines? Clean a
          tracking link?
        </p>
        <p>Unannoy tries to make those little tasks fast, friendly, and slightly less annoying.</p>
      </div>

      <section className="mt-10 rounded-[28px] border border-border bg-surface/75 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">What we believe</h2>
        <ul className="mt-4 grid gap-3 text-muted">
          <li>Small tools should be fast.</li>
          <li>Utility websites should not feel like punishment.</li>
          <li>You should not need an account to count words.</li>
          <li>You should not need to upload private text to clean it.</li>
          <li>Good design makes boring tasks feel lighter.</li>
        </ul>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-[28px] border border-border bg-surface/75 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">Privacy-first by default</h2>
          <p className="mt-3 leading-7 text-muted">
            Most Unannoy tools are designed to run directly in your browser. That means your text, code, links, and
            files are processed on your device whenever possible.
          </p>
        </div>
        <div className="rounded-[28px] border border-border bg-surface/75 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">Still growing</h2>
          <p className="mt-3 leading-7 text-muted">
            Unannoy is starting with text, developer, and Markdown tools. Over time, it will expand into link tools,
            image tools, PDF tools, time tools, and other tiny internet lifesavers.
          </p>
        </div>
      </section>
    </article>
  );
}

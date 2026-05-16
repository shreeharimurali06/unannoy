import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";

const links = [
  { href: "/tools", label: "All tools" },
  { href: "/text-cleaner", label: "Text Cleaner" },
  { href: "/json-formatter", label: "JSON Formatter" },
  { href: "/word-counter", label: "Word Counter" },
  { href: "/url-cleaner", label: "URL Cleaner" },
];

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-4 py-16 sm:px-6 lg:px-8">
      <meta name="robots" content="noindex" />
      <section className="w-full rounded-[34px] border border-border bg-surface/82 p-7 shadow-[var(--shadow)] md:p-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Construction className="h-5 w-5" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-primary">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">This page is still annoying.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          The link wandered off, the page never existed, or a tiny internet chore got ideas above its station.
          Try one of these useful doors instead.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-soft/70 px-4 py-3 font-medium transition hover:border-primary/60 hover:bg-surface"
            >
              {link.label}
              <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}


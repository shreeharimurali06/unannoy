import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedSurface } from "@/components/animated-surface";
import { RetroWireframeVisual } from "@/components/retro-wireframe-visual";
import { ToolGrid } from "@/components/tools/tool-grid";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/constants";
import { toolCategories } from "@/lib/tools/categories";
import { getPublishedTool, publishedTools } from "@/lib/tools/tool-registry";
import type { ToolDefinition } from "@/lib/tools/tool-types";

const trustNotes = ["No sign-up", "Runs in your browser", "Fast and free", "Light & dark mode"];
const featuredSlugs = [
  "text-cleaner",
  "word-counter",
  "json-formatter",
  "markdown-viewer",
  "qr-code-generator",
  "image-compressor",
  "online-timer",
  "url-cleaner",
];
const popularSlugs = [
  "character-counter",
  "remove-extra-spaces",
  "find-and-replace",
  "base64-encoder-decoder",
  "markdown-table-generator",
  "utm-builder",
  "stopwatch",
];

function isTool(tool: ToolDefinition | undefined): tool is ToolDefinition {
  return Boolean(tool);
}

export default function Home() {
  const featuredTools = featuredSlugs.map(getPublishedTool).filter(isTool);
  const popularTools = popularSlugs.map(getPublishedTool).filter(isTool);
  const visibleCategories = toolCategories.filter((category) =>
    ["text", "developer", "markdown", "links", "image", "time"].includes(category.id),
  );

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid min-w-0 max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center lg:px-8">
        <div className="absolute inset-0 -z-10 dot-grid opacity-45" />
        <div className="min-w-0">
          <p className="inline-flex rounded-full border border-border bg-surface/80 px-4 py-2 text-sm font-medium text-muted shadow-sm">
            Unannoy fixes tiny annoying digital tasks.
          </p>
          <h1 className="mt-6 max-w-4xl break-words text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            {SITE_TAGLINE}
          </h1>
          <p className="mt-6 max-w-2xl break-words text-lg leading-8 text-muted">{SITE_DESCRIPTION}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/text-cleaner"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background shadow-sm transition hover:opacity-90"
            >
              Start with Text Cleaner <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface/80 px-6 py-3 font-medium transition hover:bg-surface-soft"
            >
              Browse all tools
            </Link>
          </div>
          <ul className="mt-7 grid gap-3 text-sm text-muted sm:grid-cols-2">
            {trustNotes.map((note) => (
              <li key={note} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {note}
              </li>
            ))}
          </ul>
        </div>
        <RetroWireframeVisual />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Featured tools</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Useful first. Playful second.</h2>
          </div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            Browse all tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ToolGrid tools={featuredTools} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <AnimatedSurface className="p-7 md:p-9" hover>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">why this exists</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Small tasks should not demand five tabs.</h2>
          <p className="mt-4 leading-7 text-muted">
            Small tasks should not require ugly websites, sign-ups, popups, or five tabs. Unannoy gives you tiny tools
            that just do the thing.
          </p>
        </AnimatedSurface>
        <AnimatedSurface className="p-7 md:p-9" hover>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">privacy first</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Your browser does the work.</h2>
          <p className="mt-4 leading-7 text-muted">
            Most tools process data directly in your browser. No account. No saved history. No unnecessary uploads.
          </p>
        </AnimatedSurface>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Categories</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">A tidy shelf for little fixes</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category) => {
            const count = publishedTools.filter((tool) => tool.category === category.id).length;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="rounded-[24px] border border-border bg-surface/72 p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/50"
              >
                <h3 className="text-xl font-semibold">{category.title}</h3>
                <p className="mt-2 text-sm text-muted">{count ? `${count} published tools` : "Coming later, not linked to drafts"}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Popular tools</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">The chores most likely to steal your afternoon</h2>
        </div>
        <ToolGrid tools={popularTools} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-border bg-foreground p-8 text-background shadow-[var(--shadow)] md:p-12">
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight">Fix the tiny thing annoying you.</h2>
          <p className="mt-4 max-w-2xl text-background/75">
            Paste the messy bit, push a button, and get back to the task you actually meant to do.
          </p>
          <Link
            href="/tools"
            className="mt-7 inline-flex rounded-full bg-background px-6 py-3 font-medium text-foreground"
          >
            Browse all tools
          </Link>
        </div>
      </section>
    </div>
  );
}

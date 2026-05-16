import { ToolGrid } from "@/components/tools/tool-grid";
import { getPublishedToolsByCategory } from "@/lib/tools/tool-registry";
import type { ToolCategory } from "@/lib/tools/tool-types";

export function ToolCategoryPage({
  eyebrow,
  title,
  description,
  categories,
  emptyTitle = "More tools are being sharpened.",
}: {
  eyebrow: string;
  title: string;
  description: string;
  categories: ToolCategory[];
  emptyTitle?: string;
}) {
  const tools = getPublishedToolsByCategory(categories);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{description}</p>
      <div className="mt-10">
        {tools.length ? (
          <ToolGrid tools={tools} />
        ) : (
          <section className="rounded-[30px] border border-border bg-surface/75 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">{emptyTitle}</h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted">
              This category exists so the library can grow cleanly, but unfinished tools stay off public shelves until
              they are actually useful.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

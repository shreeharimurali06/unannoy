import type { Metadata } from "next";
import { ToolDirectory } from "@/components/tools/tool-directory";
import { categoryContent } from "@/lib/tools/tool-content";
import { publishedTools } from "@/lib/tools/tool-registry";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Browse published Unannoy tools for text cleanup, word counting, JSON formatting, Markdown preview, and tiny digital chores.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  const content = categoryContent.tools;

  return (
    <div className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Tool drawer</p>
      <h1 className="mt-3 max-w-4xl break-words text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        All published Unannoy tools
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
        {content.intro} Search by job, filter by category, and only the tools that are actually ready appear here.
        The unfinished ones are not hiding in the couch cushions.
      </p>
      <div className="mt-10">
        <ToolDirectory tools={publishedTools} />
      </div>
    </div>
  );
}

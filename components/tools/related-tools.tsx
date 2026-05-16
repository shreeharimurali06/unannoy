"use client";

import { ToolGrid } from "@/components/tools/tool-grid";
import { trackEvent } from "@/lib/analytics";
import { getRelatedPublishedTools } from "@/lib/tools/tool-registry";
import type { ToolDefinition } from "@/lib/tools/tool-types";

export function RelatedTools({ tool }: { tool: ToolDefinition }) {
  const related = getRelatedPublishedTools(tool);
  if (!related.length) return null;

  return (
    <section
      onClick={(event) => {
        const link = (event.target as HTMLElement).closest("a");
        if (link) trackEvent("related_tool_clicked", { tool_slug: tool.slug, category: tool.category });
      }}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Related tools</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Nearby tiny fixes</h2>
      <div className="mt-4">
        <ToolGrid tools={related} />
      </div>
    </section>
  );
}

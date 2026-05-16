import { ToolCard } from "@/components/tools/tool-card";
import type { ToolDefinition } from "@/lib/tools/tool-types";

export function ToolGrid({ tools }: { tools: ToolDefinition[] }) {
  if (!tools.length) {
    return (
      <div className="rounded-[28px] border border-border bg-surface/72 p-6 text-muted">
        Nothing public here yet. The shelf is being measured twice before anything gets nailed to it.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  );
}

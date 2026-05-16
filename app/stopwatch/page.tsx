import { StopwatchTool } from "@/components/tools/image-time-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { categoryContent, toolContent } from "@/lib/tools/tool-content";

const slug = "stopwatch";
const content = (toolContent as Partial<Record<string, ToolContent>>)[slug] ?? categoryContent.time;

export const metadata = getToolMetadata(slug);

export default function StopwatchPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <StopwatchTool toolSlug={slug} />
    </ToolPageShell>
  );
}

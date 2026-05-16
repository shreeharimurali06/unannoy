import { LineCounterTool } from "@/components/tools/text-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "line-counter";

export const metadata = getToolMetadata(slug);

export default function LineCounterPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <LineCounterTool toolSlug={slug} />
    </ToolPageShell>
  );
}

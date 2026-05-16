import { ReadingTimeCalculatorTool } from "@/components/tools/text-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "reading-time-calculator";

export const metadata = getToolMetadata(slug);

export default function ReadingTimeCalculatorPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <ReadingTimeCalculatorTool toolSlug={slug} />
    </ToolPageShell>
  );
}

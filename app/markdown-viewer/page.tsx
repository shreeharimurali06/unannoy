import { MarkdownViewerTool } from "@/components/tools/developer-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "markdown-viewer";

export const metadata = getToolMetadata(slug);

export default function MarkdownViewerPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <MarkdownViewerTool />
    </ToolPageShell>
  );
}

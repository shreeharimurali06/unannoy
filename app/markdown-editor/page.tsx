import { MarkdownEditorTool } from "@/components/tools/developer-extra-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "markdown-editor";

export const metadata = getToolMetadata(slug);

export default function MarkdownEditorPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <MarkdownEditorTool toolSlug={slug} />
    </ToolPageShell>
  );
}


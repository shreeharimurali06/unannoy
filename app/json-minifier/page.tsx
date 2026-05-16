import { JsonMinifierTool } from "@/components/tools/developer-extra-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "json-minifier";

export const metadata = getToolMetadata(slug);

export default function JsonMinifierPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <JsonMinifierTool toolSlug={slug} />
    </ToolPageShell>
  );
}


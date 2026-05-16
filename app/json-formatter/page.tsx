import { JsonFormatterTool } from "@/components/tools/developer-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "json-formatter";

export const metadata = getToolMetadata(slug);

export default function JsonFormatterPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <JsonFormatterTool />
    </ToolPageShell>
  );
}

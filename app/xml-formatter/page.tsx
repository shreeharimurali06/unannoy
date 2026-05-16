import { XmlFormatterTool } from "@/components/tools/developer-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "xml-formatter";

export const metadata = getToolMetadata(slug);

export default function XmlFormatterPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <XmlFormatterTool />
    </ToolPageShell>
  );
}

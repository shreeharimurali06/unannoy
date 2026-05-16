import { UrlCleanerTool } from "@/components/tools/link-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "url-cleaner";

export const metadata = getToolMetadata(slug);

export default function UrlCleanerPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <UrlCleanerTool toolSlug={slug} />
    </ToolPageShell>
  );
}


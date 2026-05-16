import { ListCleanerTool } from "@/components/tools/text-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "list-cleaner";

export const metadata = getToolMetadata(slug);

export default function ListCleanerPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <ListCleanerTool toolSlug={slug} />
    </ToolPageShell>
  );
}

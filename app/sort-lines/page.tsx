import { SortLinesTool } from "@/components/tools/text-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "sort-lines";

export const metadata = getToolMetadata(slug);

export default function SortLinesPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <SortLinesTool toolSlug={slug} />
    </ToolPageShell>
  );
}

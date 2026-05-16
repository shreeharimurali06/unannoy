import { RemoveDuplicateLinesTool } from "@/components/tools/text-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "remove-duplicate-lines";

export const metadata = getToolMetadata(slug);

export default function RemoveDuplicateLinesPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <RemoveDuplicateLinesTool toolSlug={slug} />
    </ToolPageShell>
  );
}

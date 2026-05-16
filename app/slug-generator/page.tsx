import { SlugGeneratorTool } from "@/components/tools/link-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "slug-generator";

export const metadata = getToolMetadata(slug);

export default function SlugGeneratorPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <SlugGeneratorTool toolSlug={slug} />
    </ToolPageShell>
  );
}


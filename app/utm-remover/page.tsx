import { UtmRemoverTool } from "@/components/tools/link-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "utm-remover";

export const metadata = getToolMetadata(slug);

export default function UtmRemoverPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <UtmRemoverTool toolSlug={slug} />
    </ToolPageShell>
  );
}


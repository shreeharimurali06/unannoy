import { JsonValidatorTool } from "@/components/tools/developer-extra-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "json-validator";

export const metadata = getToolMetadata(slug);

export default function JsonValidatorPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <JsonValidatorTool toolSlug={slug} />
    </ToolPageShell>
  );
}


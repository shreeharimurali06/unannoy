import { Base64EncoderDecoderTool } from "@/components/tools/developer-extra-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "base64-encoder-decoder";

export const metadata = getToolMetadata(slug);

export default function Base64EncoderDecoderPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <Base64EncoderDecoderTool toolSlug={slug} />
    </ToolPageShell>
  );
}


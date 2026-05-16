import { UrlEncoderDecoderTool } from "@/components/tools/link-tool-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "url-encoder-decoder";

export const metadata = getToolMetadata(slug);

export default function UrlEncoderDecoderPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <UrlEncoderDecoderTool toolSlug={slug} />
    </ToolPageShell>
  );
}


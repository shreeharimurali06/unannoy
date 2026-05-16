import { ImageCanvasTool } from "@/components/tools/image-time-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { categoryContent, toolContent } from "@/lib/tools/tool-content";

const slug = "jpg-to-png";
const content = (toolContent as Partial<Record<string, ToolContent>>)[slug] ?? categoryContent.image;

export const metadata = getToolMetadata(slug);

export default function JpgToPngPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <ImageCanvasTool toolSlug={slug} kind="jpg-to-png" />
    </ToolPageShell>
  );
}

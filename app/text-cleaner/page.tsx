import type { Metadata } from "next";
import { TextCleanerTool } from "@/components/text-cleaner-tool";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "text-cleaner";

export const metadata: Metadata = getToolMetadata(slug);

export default function TextCleanerPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <TextCleanerTool tool={slug} />
    </ToolPageShell>
  );
}

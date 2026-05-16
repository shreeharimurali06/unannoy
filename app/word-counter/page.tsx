import type { Metadata } from "next";
import { WordCounterTool } from "@/components/word-counter-tool";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "word-counter";

export const metadata: Metadata = getToolMetadata(slug);

export default function WordCounterPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <WordCounterTool />
    </ToolPageShell>
  );
}

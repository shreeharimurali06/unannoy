import type { Metadata } from "next";
import { CharacterCounterTool } from "@/components/character-counter-tool";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "character-counter";

export const metadata: Metadata = getToolMetadata(slug);

export default function CharacterCounterPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <CharacterCounterTool />
    </ToolPageShell>
  );
}

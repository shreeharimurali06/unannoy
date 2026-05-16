import type { Metadata } from "next";
import { CaseConverterTool } from "@/components/case-converter-tool";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "case-converter";

export const metadata: Metadata = getToolMetadata(slug);

export default function CaseConverterPage() {
  return (
    <ToolPageShell slug={slug} content={toolContent[slug]}>
      <CaseConverterTool />
    </ToolPageShell>
  );
}

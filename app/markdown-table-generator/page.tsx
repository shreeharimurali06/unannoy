import { MarkdownTableGeneratorTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "markdown-table-generator";
const fallbackContent = {
  intro: "Generate clean Markdown tables from pasted rows without opening a spreadsheet.",
  whatThisDoes: "Markdown Table Generator turns CSV, TSV, or HTML table input into Markdown table syntax.",
  whenToUse: "Use it for README tables, docs, issues, changelogs, and simple tabular notes.",
  howItWorks: "Paste row data, choose the input mode, and copy the generated Markdown.",
  useCases: ["Create README tables.", "Format issue summaries.", "Convert copied spreadsheet rows."],
  faqs: [{ question: "Can I edit the generated table?", answer: "Yes. Copy it and continue editing wherever you need it." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function MarkdownTableGeneratorPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <MarkdownTableGeneratorTool toolSlug={slug} />
    </ToolPageShell>
  );
}

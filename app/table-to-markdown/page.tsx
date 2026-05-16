import { TableMarkdownTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "table-to-markdown";
const fallbackContent = {
  intro: "Turn CSV, TSV, or simple HTML tables into Markdown tables in your browser.",
  whatThisDoes: "Table to Markdown parses pasted rows and creates a pipe-delimited Markdown table.",
  whenToUse: "Use it when spreadsheet or HTML table data needs to fit into a README, issue, or doc.",
  howItWorks: "Pick the input type, paste table data, then copy the Markdown table.",
  useCases: ["Convert CSV rows.", "Convert TSV from spreadsheets.", "Convert basic HTML tables."],
  faqs: [{ question: "Does it support quoted CSV?", answer: "It is designed for simple pasted tables and lightweight CSV snippets." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function TableToMarkdownPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <TableMarkdownTool toolSlug={slug} />
    </ToolPageShell>
  );
}

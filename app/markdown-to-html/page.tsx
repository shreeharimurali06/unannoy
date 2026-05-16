import { MarkdownConverterTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "markdown-to-html";
const fallbackContent = {
  intro: "Convert Markdown to copyable HTML locally with headings, lists, links, tables, and code blocks.",
  whatThisDoes: "Markdown to HTML turns pasted Markdown into HTML using the existing local renderer.",
  whenToUse: "Use it when a CMS, email tool, or ticket field wants HTML instead of Markdown.",
  howItWorks: "Paste Markdown and copy the generated HTML from the output panel.",
  useCases: ["Convert README snippets.", "Prepare CMS content.", "Turn notes into HTML blocks."],
  faqs: [{ question: "Does the conversion leave the browser?", answer: "No. It runs locally." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function MarkdownToHtmlPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <MarkdownConverterTool toolSlug={slug} mode="to-html" />
    </ToolPageShell>
  );
}

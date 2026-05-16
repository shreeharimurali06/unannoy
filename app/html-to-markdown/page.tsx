import { MarkdownConverterTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "html-to-markdown";
const fallbackContent = {
  intro: "Convert simple HTML into Markdown locally for cleaner notes, docs, and tickets.",
  whatThisDoes: "HTML to Markdown reads common tags and outputs practical Markdown.",
  whenToUse: "Use it after copying formatted content from a page, CMS, or document export.",
  howItWorks: "Paste HTML, review the Markdown, then copy the converted text.",
  useCases: ["Convert headings and lists.", "Clean pasted HTML.", "Prepare Markdown notes."],
  faqs: [{ question: "Which tags are supported?", answer: "Common headings, paragraphs, links, emphasis, lists, quotes, and code blocks are supported." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function HtmlToMarkdownPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <MarkdownConverterTool toolSlug={slug} mode="from-html" />
    </ToolPageShell>
  );
}

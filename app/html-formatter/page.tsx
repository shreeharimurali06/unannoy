import { CodeFormatterTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "html-formatter";
const fallbackContent = {
  intro: "Format HTML into readable nested markup without sending your code anywhere.",
  whatThisDoes: "HTML Formatter adds line breaks and indentation so compact markup is easier to scan.",
  whenToUse: "Use it for copied components, snippets, email markup, or CMS blocks that arrive as one long line.",
  howItWorks: "Paste HTML, choose indentation, then copy or download the formatted result.",
  useCases: ["Pretty-print copied HTML.", "Inspect nested tags.", "Clean snippets before pasting into docs."],
  faqs: [{ question: "Is this a browser-only formatter?", answer: "Yes. Formatting happens in your browser." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function HtmlFormatterPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <CodeFormatterTool toolSlug={slug} kind="html" />
    </ToolPageShell>
  );
}

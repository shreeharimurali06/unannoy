import { CodeFormatterTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "css-formatter";
const fallbackContent = {
  intro: "Format compact CSS into readable rules, declarations, and media blocks in your browser.",
  whatThisDoes: "CSS Formatter separates braces and declarations with consistent indentation.",
  whenToUse: "Use it when minified or pasted CSS needs a quick readability pass.",
  howItWorks: "Paste CSS, choose indentation, and copy the formatted output.",
  useCases: ["Inspect minified CSS.", "Clean small style snippets.", "Make media queries easier to review."],
  faqs: [{ question: "Does it rewrite selectors?", answer: "No. It focuses on whitespace and indentation." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function CssFormatterPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <CodeFormatterTool toolSlug={slug} kind="css" />
    </ToolPageShell>
  );
}

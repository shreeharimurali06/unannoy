import { CodeFormatterTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "javascript-formatter";
const fallbackContent = {
  intro: "Format JavaScript snippets locally so braces and statements are easier to inspect.",
  whatThisDoes: "JavaScript Formatter adds practical line breaks and indentation to compact JS snippets.",
  whenToUse: "Use it for short copied functions, config snippets, bookmarklets, or console code.",
  howItWorks: "Paste JavaScript, pick indentation, then copy the readable result.",
  useCases: ["Clean compact JS.", "Review copied snippets.", "Make small functions easier to scan."],
  faqs: [{ question: "Is this a full parser?", answer: "No. It is a lightweight browser formatter for practical snippets." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function JavascriptFormatterPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <CodeFormatterTool toolSlug={slug} kind="javascript" />
    </ToolPageShell>
  );
}

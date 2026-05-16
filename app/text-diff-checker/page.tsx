import { TextDiffCheckerTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "text-diff-checker";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Compare two text versions and see added, removed, and unchanged lines.",
  whatThisDoes: "Text Diff Checker creates a simple line-by-line diff for drafts, notes, snippets, and copied content.",
  whenToUse: "Use it when two versions look similar but you need to spot the exact line changes.",
  howItWorks: "Paste both versions, review the color-coded diff, and copy a plain diff summary.",
  useCases: ["Compare draft revisions.", "Check changed instructions.", "Review small config or message edits."],
  faqs: [{ question: "Is this a code diff tool?", answer: "It works for code snippets, but it is intentionally a simple line diff for everyday text." }],
};

export const metadata = getToolMetadata(slug);

export default function TextDiffCheckerPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <TextDiffCheckerTool toolSlug={slug} />
    </ToolPageShell>
  );
}

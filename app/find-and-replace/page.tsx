import { FindAndReplaceTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "find-and-replace";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Find text and replace it locally with match counts and regex-friendly errors.",
  whatThisDoes: "Find and Replace Text updates repeated words, labels, names, or patterns in pasted text.",
  whenToUse: "Use it before sending or publishing text that needs the same change in multiple places.",
  howItWorks: "Paste text, enter the search and replacement values, adjust matching options, and copy the output.",
  useCases: ["Rename a repeated label.", "Fix casing-sensitive references.", "Use regex for structured replacements."],
  faqs: [{ question: "Can I use regular expressions?", answer: "Yes. Enable regex mode and the tool will show a friendly error if the pattern is invalid." }],
};

export const metadata = getToolMetadata(slug);

export default function FindAndReplacePage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <FindAndReplaceTool toolSlug={slug} />
    </ToolPageShell>
  );
}

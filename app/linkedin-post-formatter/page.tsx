import { LinkedInPostFormatterTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "linkedin-post-formatter";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Format a LinkedIn post with cleaner line breaks, hook spacing, and length metrics.",
  whatThisDoes: "LinkedIn Post Formatter cleans repeated blank lines, trims rows, and can separate the opening hook from the body.",
  whenToUse: "Use it before pasting a post into LinkedIn or a scheduler.",
  howItWorks: "Paste a draft, adjust formatting options, review the output, and copy the post.",
  useCases: ["Clean post drafts.", "Separate the first hook line.", "Check rough LinkedIn length."],
  faqs: [{ question: "Will it rewrite my post?", answer: "No. It only formats spacing and preserves your wording." }],
};

export const metadata = getToolMetadata(slug);

export default function LinkedInPostFormatterPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <LinkedInPostFormatterTool toolSlug={slug} />
    </ToolPageShell>
  );
}

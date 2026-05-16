import { TwitterCharacterCounterTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "twitter-character-counter";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Count characters for an X/Twitter post before it hits the limit.",
  whatThisDoes: "X/Twitter Character Counter measures post length, remaining characters, words, lines, and hashtags.",
  whenToUse: "Use it when a post has to fit a short format without rewriting inside the platform composer.",
  howItWorks: "Paste the draft and check live length metrics against a 280-character target.",
  useCases: ["Trim posts before publishing.", "Check thread chunks.", "Count hashtags and line breaks."],
  faqs: [{ question: "Does this match every platform weighting rule?", answer: "It uses plain character counts for practical drafting, not every weighted character edge case." }],
};

export const metadata = getToolMetadata(slug);

export default function TwitterCharacterCounterPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <TwitterCharacterCounterTool toolSlug={slug} />
    </ToolPageShell>
  );
}

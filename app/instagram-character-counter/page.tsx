import { InstagramCharacterCounterTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "instagram-character-counter";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Count Instagram caption characters, words, lines, and hashtags before posting.",
  whatThisDoes: "Instagram Character Counter checks caption length against the common 2200-character limit.",
  whenToUse: "Use it when a caption, hashtag set, or promotional post needs to fit before publishing.",
  howItWorks: "Paste the caption and the live metrics update locally in your browser.",
  useCases: ["Check caption length.", "Count hashtags.", "Trim long social drafts."],
  faqs: [{ question: "Does it enforce Instagram rules?", answer: "It gives practical length metrics; always verify platform behavior for edge cases." }],
};

export const metadata = getToolMetadata(slug);

export default function InstagramCharacterCounterPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <InstagramCharacterCounterTool toolSlug={slug} />
    </ToolPageShell>
  );
}

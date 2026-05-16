import { InstagramLineBreaksTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "instagram-line-breaks";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Format Instagram captions with line breaks that are easier to paste and preserve.",
  whatThisDoes: "Instagram Line Break Formatter trims caption lines and can add dot spacer lines for visual breaks.",
  whenToUse: "Use it before pasting a caption that needs readable paragraph spacing.",
  howItWorks: "Paste a caption, choose line-break options, then copy the formatted caption.",
  useCases: ["Prepare caption paragraphs.", "Keep spacing around hashtags.", "Clean draft caption whitespace."],
  faqs: [{ question: "Why use dot spacer lines?", answer: "Some Instagram workflows preserve visible spacer lines more reliably than empty rows." }],
};

export const metadata = getToolMetadata(slug);

export default function InstagramLineBreaksPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <InstagramLineBreaksTool toolSlug={slug} />
    </ToolPageShell>
  );
}

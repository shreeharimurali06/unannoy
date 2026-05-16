import { MetaDescriptionCheckerTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "meta-description-checker";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Check meta description length against a practical search snippet target.",
  whatThisDoes: "Meta Description Length Checker counts characters, words, lines, and remaining room around a 160-character target.",
  whenToUse: "Use it before adding SEO descriptions to a CMS, docs page, product page, or blog post.",
  howItWorks: "Paste the description and review live character metrics locally in your browser.",
  useCases: ["Draft SEO snippets.", "Trim product page descriptions.", "Check CMS metadata fields."],
  faqs: [{ question: "Is 160 characters a hard SEO rule?", answer: "No. It is a practical drafting target because search snippets can vary." }],
};

export const metadata = getToolMetadata(slug);

export default function MetaDescriptionCheckerPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <MetaDescriptionCheckerTool toolSlug={slug} />
    </ToolPageShell>
  );
}

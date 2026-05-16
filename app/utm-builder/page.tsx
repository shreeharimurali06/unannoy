import { UtmBuilderTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "utm-builder";
const fallbackContent = {
  intro: "Build campaign URLs with UTM parameters locally and copy the finished tracking link.",
  whatThisDoes: "UTM Builder combines a destination URL with source, medium, campaign, term, and content parameters.",
  whenToUse: "Use it before sharing campaign links in email, ads, social posts, or internal launch notes.",
  howItWorks: "Enter a destination URL, fill the UTM fields you need, and copy the generated URL.",
  useCases: ["Build newsletter links.", "Prepare ad campaign URLs.", "Create launch tracking links."],
  faqs: [{ question: "Does it shorten links?", answer: "No. It builds the full campaign URL so you can review it before sharing." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function UtmBuilderPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <UtmBuilderTool toolSlug={slug} />
    </ToolPageShell>
  );
}

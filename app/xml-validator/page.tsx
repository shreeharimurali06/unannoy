import { XmlValidatorTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "xml-validator";
const fallbackContent = {
  intro: "Validate XML locally and get a readable error when tags, roots, or nesting need attention.",
  whatThisDoes: "XML Validator checks pasted XML in your browser and reports whether it is well formed.",
  whenToUse: "Use it before sending feeds, config files, sitemap snippets, or API payloads somewhere stricter.",
  howItWorks: "Paste XML, review the validation result, then copy or clear the text without uploading it.",
  useCases: ["Check XML config snippets.", "Validate sitemap or feed fragments.", "Find malformed nesting before sharing."],
  faqs: [{ question: "Does it upload XML?", answer: "No. Validation runs locally in your browser." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function XmlValidatorPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <XmlValidatorTool toolSlug={slug} />
    </ToolPageShell>
  );
}

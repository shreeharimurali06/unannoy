import { RemoveExtraSpacesTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "remove-extra-spaces";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Remove doubled spaces, tabs, and awkward punctuation spacing from pasted text.",
  whatThisDoes: "Remove Extra Spaces cleans uneven spacing while keeping line breaks easy to review.",
  whenToUse: "Use it after copying text from PDFs, docs, emails, exports, or CMS fields.",
  howItWorks: "Paste text, choose spacing options, review the cleaned result, and copy it locally in your browser.",
  useCases: ["Clean doubled spaces before publishing.", "Normalize tabs from copied tables.", "Trim line-level spacing without changing the words."],
  faqs: [{ question: "Does this upload my text?", answer: "No. The cleanup runs in your browser." }],
};

export const metadata = getToolMetadata(slug);

export default function RemoveExtraSpacesPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <RemoveExtraSpacesTool toolSlug={slug} />
    </ToolPageShell>
  );
}

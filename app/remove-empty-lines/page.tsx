import { RemoveEmptyLinesTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "remove-empty-lines";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Remove blank rows and whitespace-only lines from pasted text.",
  whatThisDoes: "Remove Empty Lines compacts text, notes, lists, and exports while optionally keeping one blank line between blocks.",
  whenToUse: "Use it when copied text has too many gaps or accidental blank rows.",
  howItWorks: "Paste text, choose whether to preserve block spacing, then copy the cleaned result.",
  useCases: ["Compact copied notes.", "Clean CSV-like text before import.", "Remove blank rows from lists."],
  faqs: [{ question: "Can it keep paragraph spacing?", answer: "Yes. Use the option to keep one blank line between blocks." }],
};

export const metadata = getToolMetadata(slug);

export default function RemoveEmptyLinesPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <RemoveEmptyLinesTool toolSlug={slug} />
    </ToolPageShell>
  );
}

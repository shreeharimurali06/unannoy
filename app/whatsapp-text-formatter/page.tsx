import { WhatsappTextFormatterTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "whatsapp-text-formatter";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Wrap message lines with WhatsApp bold, italic, or monospace markers.",
  whatThisDoes: "WhatsApp Text Formatter applies simple WhatsApp markdown-style wrappers to each non-empty line.",
  whenToUse: "Use it when a message needs emphasis but you do not want to manually wrap every line.",
  howItWorks: "Paste message text, choose a formatting mode, then copy the formatted message.",
  useCases: ["Bold a short update.", "Format checklist headings.", "Prepare monospaced snippets for chat."],
  faqs: [{ question: "Does it send the message?", answer: "No. It only prepares text for you to copy." }],
};

export const metadata = getToolMetadata(slug);

export default function WhatsappTextFormatterPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <WhatsappTextFormatterTool toolSlug={slug} />
    </ToolPageShell>
  );
}

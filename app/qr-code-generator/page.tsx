import { QrCodeGeneratorTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "qr-code-generator";
const fallbackContent = {
  intro: "Generate a downloadable SVG QR code from a URL or text without sending it to a server.",
  whatThisDoes: "QR Code Generator creates an SVG QR code in your browser from the content you enter.",
  whenToUse: "Use it for quick links, event signs, print drafts, Wi-Fi strings, or local testing.",
  howItWorks: "Enter content, preview the QR code, then copy or download the SVG.",
  useCases: ["Make a QR for a URL.", "Create printable QR drafts.", "Share short text through a QR code."],
  faqs: [{ question: "What format downloads?", answer: "The generated QR code downloads as SVG." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function QrCodeGeneratorPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <QrCodeGeneratorTool toolSlug={slug} />
    </ToolPageShell>
  );
}

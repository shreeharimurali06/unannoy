import { QrCodeReaderTool } from "@/components/tools/format-markdown-link-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "qr-code-reader";
const fallbackContent = {
  intro: "Read a QR code from an image locally when your browser supports the Barcode Detector API.",
  whatThisDoes: "QR Code Reader scans an uploaded image in your browser and shows the decoded text.",
  whenToUse: "Use it to inspect a saved QR image before sharing, printing, or trusting the destination.",
  howItWorks: "Choose an image file, let the browser scan it locally, and copy the decoded result.",
  useCases: ["Inspect QR destinations.", "Decode a saved QR screenshot.", "Check print artwork before publishing."],
  faqs: [{ question: "Why might scanning be unavailable?", answer: "Some browsers do not expose local QR detection yet." }],
} satisfies ToolContent;

export const metadata = getToolMetadata(slug);

export default function QrCodeReaderPage() {
  return (
    <ToolPageShell slug={slug} content={(toolContent as Partial<Record<string, ToolContent>>)[slug] ?? fallbackContent}>
      <QrCodeReaderTool toolSlug={slug} />
    </ToolPageShell>
  );
}

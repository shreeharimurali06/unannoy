import { SpeakingTimeCalculatorTool } from "@/components/tools/text-social-widgets";
import { getToolMetadata, ToolPageShell } from "@/components/tools/tool-page-shell";
import type { ToolContent } from "@/components/tools/tool-seo-content";
import { toolContent } from "@/lib/tools/tool-content";

const slug = "speaking-time-calculator";
const content: ToolContent = toolContent[slug as keyof typeof toolContent] ?? {
  intro: "Estimate how long a script, voiceover, pitch, or talking point set will take to say out loud.",
  whatThisDoes: "Speaking Time Calculator counts words and estimates duration from an adjustable words-per-minute speed.",
  whenToUse: "Use it before recording, presenting, timing a demo, or planning a meeting update.",
  howItWorks: "Paste your script, adjust the speaking speed, and copy the estimate.",
  useCases: ["Time a voiceover script.", "Plan a meeting intro.", "Estimate a short presentation."],
  faqs: [{ question: "Is the timing exact?", answer: "No. It is a planning estimate based on the selected speaking speed." }],
};

export const metadata = getToolMetadata(slug);

export default function SpeakingTimeCalculatorPage() {
  return (
    <ToolPageShell slug={slug} content={content}>
      <SpeakingTimeCalculatorTool toolSlug={slug} />
    </ToolPageShell>
  );
}

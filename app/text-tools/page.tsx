import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/tool-category-page";
import { categoryContent } from "@/lib/tools/tool-content";

export const metadata: Metadata = {
  title: "Text Tools",
  description: "Published Unannoy text tools for cleaning, counting, sorting, deduping, and reshaping text locally.",
  alternates: { canonical: "/text-tools" },
};

export default function TextToolsPage() {
  return (
    <ToolCategoryPage
      eyebrow="Text tools"
      title="Paste, fix, move on."
      description={categoryContent.text.intro}
      categories={["text", "social-writing"]}
    />
  );
}

import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/tool-category-page";
import { categoryContent } from "@/lib/tools/tool-content";

export const metadata: Metadata = {
  title: "Markdown Tools",
  description: "Published Unannoy Markdown tools for previewing docs, notes, readmes, and formatted plain text locally.",
  alternates: { canonical: "/markdown-tools" },
};

export default function MarkdownToolsPage() {
  return (
    <ToolCategoryPage
      eyebrow="Markdown tools"
      title="Preview before the README judges you."
      description={categoryContent.markdown.intro}
      categories={["markdown"]}
    />
  );
}

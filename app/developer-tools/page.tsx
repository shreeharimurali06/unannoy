import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/tool-category-page";
import { categoryContent } from "@/lib/tools/tool-content";

export const metadata: Metadata = {
  title: "Developer Tools",
  description: "Published Unannoy developer tools for formatting and inspecting JSON, XML, and structured snippets locally.",
  alternates: { canonical: "/developer-tools" },
};

export default function DeveloperToolsPage() {
  return (
    <ToolCategoryPage
      eyebrow="Developer tools"
      title="Small formatters for big little messes."
      description={categoryContent.developer.intro}
      categories={["developer"]}
    />
  );
}

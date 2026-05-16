import type { ToolCategory } from "@/lib/tools/tool-types";

export type ToolCategoryDefinition = {
  id: ToolCategory;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
};

export const toolCategories: ToolCategoryDefinition[] = [
  {
    id: "text",
    title: "Text Tools",
    shortTitle: "Text",
    href: "/text-tools",
    description: "Clean, count, sort, dedupe, and reshape pasted text without sending it anywhere.",
  },
  {
    id: "social-writing",
    title: "Social Writing Tools",
    shortTitle: "Social writing",
    href: "/text-tools",
    description: "Small helpers for captions, posts, bios, and platform-specific writing limits.",
  },
  {
    id: "developer",
    title: "Developer Tools",
    shortTitle: "Developer",
    href: "/developer-tools",
    description: "Format JSON, XML, HTML, CSS, JavaScript, and other developer chores in your browser.",
  },
  {
    id: "markdown",
    title: "Markdown Tools",
    shortTitle: "Markdown",
    href: "/markdown-tools",
    description: "Preview, convert, and clean Markdown for docs, notes, readmes, and tables.",
  },
  {
    id: "links",
    title: "Link Tools",
    shortTitle: "Links",
    href: "/link-tools",
    description: "Clean, encode, decode, and build links without the usual tab-hopping.",
  },
  {
    id: "image",
    title: "Image Tools",
    shortTitle: "Images",
    href: "/image-tools",
    description: "Browser-first helpers for resizing, converting, compressing, and tidying images.",
  },
  {
    id: "pdf",
    title: "PDF Tools",
    shortTitle: "PDF",
    href: "/tools",
    description: "Planned PDF helpers for tiny document chores.",
  },
  {
    id: "time",
    title: "Time Tools",
    shortTitle: "Time",
    href: "/time-tools",
    description: "Simple timers and time utilities for everyday work.",
  },
  {
    id: "student",
    title: "Student Tools",
    shortTitle: "Student",
    href: "/tools",
    description: "Study-friendly tools for essays, notes, citations, and counting limits.",
  },
];

export function getCategory(category: ToolCategory) {
  return toolCategories.find((item) => item.id === category);
}

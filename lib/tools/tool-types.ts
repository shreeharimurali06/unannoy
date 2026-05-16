export type ToolCategory =
  | "text"
  | "social-writing"
  | "developer"
  | "markdown"
  | "links"
  | "image"
  | "pdf"
  | "time"
  | "student";

export type ToolStatus = "published" | "draft" | "planned";

export interface ToolDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  relatedTools: string[];
  isLocalOnly: boolean;
}

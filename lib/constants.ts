export const SITE_NAME = "Unannoy";
export const SITE_TAGLINE = "Tiny tools for wildly annoying tasks.";
export const SITE_DESCRIPTION =
  "Clean messy text, count words, format JSON, preview Markdown, fix lists, and handle everyday digital chores without signing up.";
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export const CORE_ROUTES = [
  "",
  "tools",
  "text-tools",
  "developer-tools",
  "markdown-tools",
  "link-tools",
  "privacy",
  "terms",
  "about",
  "contact",
] as const;

import type { ToolCategory, ToolDefinition, ToolStatus } from "@/lib/tools/tool-types";
import { additionalPublishedTools } from "@/lib/tools/additional-tool-definitions";

const published = "published" satisfies ToolStatus;

export const toolRegistry: ToolDefinition[] = [
  {
    slug: "text-cleaner",
    title: "Text Cleaner",
    shortTitle: "Text Cleaner",
    description: "Trim messy lines, remove odd spacing, delete empty rows, and make copied text behave.",
    category: "text",
    status: published,
    seoTitle: "Text Cleaner - Clean Messy Text Online",
    seoDescription:
      "Clean messy text in your browser. Trim lines, remove extra spaces, empty lines, tabs, duplicates, and invisible characters.",
    keywords: ["text cleaner", "clean text", "remove extra spaces", "trim lines"],
    relatedTools: ["word-counter", "character-counter", "case-converter", "remove-duplicate-lines"],
    isLocalOnly: true,
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    shortTitle: "Word Counter",
    description: "Count words, characters, sentences, paragraphs, lines, and reading time.",
    category: "text",
    status: published,
    seoTitle: "Word Counter - Count Words, Characters, and Reading Time",
    seoDescription:
      "Count words, characters, sentences, paragraphs, lines, reading time, and speaking time locally in your browser.",
    keywords: ["word counter", "count words", "reading time", "speaking time"],
    relatedTools: ["character-counter", "reading-time-calculator", "text-cleaner", "line-counter"],
    isLocalOnly: true,
  },
  {
    slug: "character-counter",
    title: "Character Counter",
    shortTitle: "Character Counter",
    description: "Count characters and check text against common platform limits.",
    category: "text",
    status: published,
    seoTitle: "Character Counter - Count Characters and Check Limits",
    seoDescription:
      "Count characters with and without spaces, words, lines, paragraphs, and check text against common character limits.",
    keywords: ["character counter", "count characters", "twitter limit", "meta description length"],
    relatedTools: ["word-counter", "line-counter", "case-converter", "reading-time-calculator"],
    isLocalOnly: true,
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    shortTitle: "Case Converter",
    description: "Convert text to uppercase, lowercase, title case, camelCase, snake_case, slugs, and more.",
    category: "text",
    status: published,
    seoTitle: "Case Converter - Convert Uppercase, Title Case, camelCase, and Slugs",
    seoDescription:
      "Convert text case in your browser: uppercase, lowercase, sentence case, title case, camelCase, PascalCase, snake_case, kebab-case, and slug-case.",
    keywords: ["case converter", "title case", "camelCase", "slug case"],
    relatedTools: ["text-cleaner", "character-counter", "json-formatter", "markdown-viewer"],
    isLocalOnly: true,
  },
  {
    slug: "remove-duplicate-lines",
    title: "Remove Duplicate Lines",
    shortTitle: "Deduplicate Lines",
    description: "Remove repeated lines while keeping control over trimming, case matching, and sorting.",
    category: "text",
    status: published,
    seoTitle: "Remove Duplicate Lines - Deduplicate Text Lines Online",
    seoDescription:
      "Remove duplicate lines from pasted text locally in your browser with options for case sensitivity, trimming, sorting, and empty lines.",
    keywords: ["remove duplicate lines", "deduplicate lines", "unique lines", "list deduper"],
    relatedTools: ["sort-lines", "list-cleaner", "line-counter", "text-cleaner"],
    isLocalOnly: true,
  },
  {
    slug: "sort-lines",
    title: "Sort Lines Alphabetically",
    shortTitle: "Sort Lines",
    description: "Sort pasted lines A to Z or Z to A with numeric sorting, duplicate removal, and cleanup options.",
    category: "text",
    status: published,
    seoTitle: "Sort Lines Alphabetically - A to Z and Z to A",
    seoDescription:
      "Sort lines alphabetically in your browser. Choose A to Z, Z to A, case-sensitive matching, numeric sort, empty-line removal, and deduping.",
    keywords: ["sort lines", "alphabetize lines", "sort list", "line sorter"],
    relatedTools: ["remove-duplicate-lines", "list-cleaner", "line-counter", "text-cleaner"],
    isLocalOnly: true,
  },
  {
    slug: "line-counter",
    title: "Line Counter",
    shortTitle: "Line Counter",
    description: "Count total, empty, non-empty, duplicate, longest, and average line length.",
    category: "text",
    status: published,
    seoTitle: "Line Counter - Count Lines, Empty Lines, and Duplicate Lines",
    seoDescription:
      "Count lines in pasted text locally: total lines, non-empty lines, empty lines, duplicates, longest line, and average line length.",
    keywords: ["line counter", "count lines", "empty lines", "duplicate lines"],
    relatedTools: ["word-counter", "sort-lines", "remove-duplicate-lines", "text-cleaner"],
    isLocalOnly: true,
  },
  {
    slug: "list-cleaner",
    title: "List Cleaner",
    shortTitle: "List Cleaner",
    description: "Split, join, dedupe, trim, bullet, number, quote, and reshape lists.",
    category: "text",
    status: published,
    seoTitle: "List Cleaner - Clean, Split, Join, and Format Lists",
    seoDescription:
      "Clean pasted lists in your browser. Split comma-separated text, join with separators, remove duplicates, trim spaces, add bullets, number items, and quote entries.",
    keywords: ["list cleaner", "format list", "comma separated list", "bullet list"],
    relatedTools: ["remove-duplicate-lines", "sort-lines", "line-counter", "text-cleaner"],
    isLocalOnly: true,
  },
  {
    slug: "reading-time-calculator",
    title: "Reading Time Calculator",
    shortTitle: "Reading Time",
    description: "Estimate reading and speaking time from pasted articles, scripts, newsletters, or posts.",
    category: "text",
    status: published,
    seoTitle: "Reading Time Calculator - Estimate Reading and Speaking Time",
    seoDescription:
      "Calculate reading time, speaking time, and word count from pasted text using slow, average, fast, or custom reading speeds.",
    keywords: ["reading time calculator", "speaking time", "word count", "article time"],
    relatedTools: ["word-counter", "character-counter", "line-counter", "markdown-viewer"],
    isLocalOnly: true,
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    shortTitle: "JSON Formatter",
    description: "Format, minify, and validate JSON with friendly browser-only errors.",
    category: "developer",
    status: published,
    seoTitle: "JSON Formatter - Format, Minify, and Validate JSON",
    seoDescription:
      "Format, prettify, minify, and validate JSON locally in your browser with indentation options and helpful parse errors.",
    keywords: ["json formatter", "json validator", "prettify json", "minify json"],
    relatedTools: ["json-validator", "json-minifier", "xml-formatter", "markdown-viewer"],
    isLocalOnly: true,
  },
  {
    slug: "xml-formatter",
    title: "XML Formatter",
    shortTitle: "XML Formatter",
    description: "Format and validate XML in your browser with readable indentation and friendly errors.",
    category: "developer",
    status: published,
    seoTitle: "XML Formatter - Format and Validate XML Online",
    seoDescription:
      "Format, prettify, and validate XML locally in your browser with indentation options, sample XML, copy, and clear controls.",
    keywords: ["xml formatter", "xml validator", "prettify xml", "format xml"],
    relatedTools: ["json-formatter", "markdown-viewer", "text-cleaner", "case-converter"],
    isLocalOnly: true,
  },
  {
    slug: "markdown-viewer",
    title: "Markdown Viewer",
    shortTitle: "Markdown Viewer",
    description: "Preview Markdown as HTML with headings, lists, links, tables, quotes, and code blocks.",
    category: "markdown",
    status: published,
    seoTitle: "Markdown Viewer - Preview Markdown Locally",
    seoDescription:
      "Preview Markdown locally in your browser with a split desktop view, mobile-friendly layout, sample Markdown, and copyable HTML.",
    keywords: ["markdown viewer", "markdown preview", "preview markdown", "markdown to html"],
    relatedTools: ["markdown-editor", "json-formatter", "xml-formatter", "word-counter"],
    isLocalOnly: true,
  },
  {
    slug: "url-cleaner",
    title: "URL Cleaner",
    shortTitle: "URL Cleaner",
    description: "Remove tracking parameters from long links while keeping the destination intact.",
    category: "links",
    status: published,
    seoTitle: "URL Cleaner - Remove Tracking Parameters from Links",
    seoDescription:
      "Clean URLs locally in your browser. Remove UTM parameters, fbclid, gclid, ref, and other common tracking clutter from pasted links.",
    keywords: ["url cleaner", "remove tracking parameters", "clean link", "remove fbclid"],
    relatedTools: ["utm-remover", "url-encoder-decoder", "slug-generator", "text-cleaner"],
    isLocalOnly: true,
  },
  {
    slug: "utm-remover",
    title: "UTM Remover",
    shortTitle: "UTM Remover",
    description: "Remove UTM campaign parameters from shared links with a focused browser-only cleaner.",
    category: "links",
    status: published,
    seoTitle: "UTM Remover - Remove UTM Parameters from URLs",
    seoDescription:
      "Remove utm_source, utm_medium, utm_campaign, utm_term, and utm_content from URLs locally in your browser.",
    keywords: ["utm remover", "remove utm parameters", "clean campaign url", "utm cleaner"],
    relatedTools: ["url-cleaner", "url-encoder-decoder", "slug-generator", "json-formatter"],
    isLocalOnly: true,
  },
  {
    slug: "slug-generator",
    title: "Slug Generator",
    shortTitle: "Slug Generator",
    description: "Turn titles and labels into clean URL slugs with length, separator, and stop-word options.",
    category: "links",
    status: published,
    seoTitle: "Slug Generator - Create Clean URL Slugs",
    seoDescription:
      "Generate URL slugs locally from titles or text. Choose hyphens or underscores, lowercase output, remove stop words, and set max length.",
    keywords: ["slug generator", "url slug", "create slug", "seo slug"],
    relatedTools: ["case-converter", "url-cleaner", "markdown-editor", "text-cleaner"],
    isLocalOnly: true,
  },
  {
    slug: "base64-encoder-decoder",
    title: "Base64 Encoder/Decoder",
    shortTitle: "Base64",
    description: "Encode text to Base64 or decode Base64 back to readable UTF-8 text.",
    category: "developer",
    status: published,
    seoTitle: "Base64 Encoder/Decoder - Encode and Decode Base64 Text",
    seoDescription:
      "Encode text to Base64 and decode Base64 to UTF-8 text locally in your browser with friendly invalid-input errors.",
    keywords: ["base64 encoder", "base64 decoder", "decode base64", "encode base64"],
    relatedTools: ["url-encoder-decoder", "json-validator", "json-minifier", "json-formatter"],
    isLocalOnly: true,
  },
  {
    slug: "url-encoder-decoder",
    title: "URL Encoder/Decoder",
    shortTitle: "URL Encoder",
    description: "Encode or decode URL components and full URLs without sending the text anywhere.",
    category: "links",
    status: published,
    seoTitle: "URL Encoder/Decoder - Encode and Decode URL Text",
    seoDescription:
      "Encode URL components, decode percent-encoded text, and work with full URLs locally in your browser.",
    keywords: ["url encoder", "url decoder", "encode url", "decode url component"],
    relatedTools: ["url-cleaner", "utm-remover", "base64-encoder-decoder", "slug-generator"],
    isLocalOnly: true,
  },
  {
    slug: "json-validator",
    title: "JSON Validator",
    shortTitle: "JSON Validator",
    description: "Validate JSON and get friendly browser-only parse errors with line and position when available.",
    category: "developer",
    status: published,
    seoTitle: "JSON Validator - Validate JSON Locally",
    seoDescription:
      "Validate JSON locally in your browser, see valid or invalid status, format valid JSON, and get helpful parse error details.",
    keywords: ["json validator", "validate json", "json parse error", "check json"],
    relatedTools: ["json-formatter", "json-minifier", "base64-encoder-decoder", "xml-formatter"],
    isLocalOnly: true,
  },
  {
    slug: "json-minifier",
    title: "JSON Minifier",
    shortTitle: "JSON Minifier",
    description: "Validate and minify JSON with before-and-after size metrics.",
    category: "developer",
    status: published,
    seoTitle: "JSON Minifier - Minify JSON Locally",
    seoDescription:
      "Minify JSON locally in your browser, validate input, copy compact JSON, and compare size before and after minifying.",
    keywords: ["json minifier", "minify json", "compact json", "json compressor"],
    relatedTools: ["json-formatter", "json-validator", "base64-encoder-decoder", "xml-formatter"],
    isLocalOnly: true,
  },
  {
    slug: "markdown-editor",
    title: "Markdown Editor Preview",
    shortTitle: "Markdown Editor",
    description: "Write Markdown in a split editor and preview rendered headings, lists, tables, quotes, and code.",
    category: "markdown",
    status: published,
    seoTitle: "Markdown Editor Preview - Edit and Preview Markdown Locally",
    seoDescription:
      "Edit Markdown and preview rendered HTML locally in your browser with support for headings, lists, links, tables, blockquotes, and code blocks.",
    keywords: ["markdown editor", "markdown preview", "markdown editor preview", "copy markdown"],
    relatedTools: ["markdown-viewer", "word-counter", "reading-time-calculator", "slug-generator"],
    isLocalOnly: true,
  },
  ...additionalPublishedTools,
];

export const publishedTools = toolRegistry.filter((tool) => tool.status === "published");
export const draftTools = toolRegistry.filter((tool) => tool.status === "draft");
export const plannedTools = toolRegistry.filter((tool) => tool.status === "planned");

export function getTool(slug: string) {
  return toolRegistry.find((tool) => tool.slug === slug);
}

export function getPublishedTool(slug: string) {
  const tool = getTool(slug);
  return tool?.status === "published" ? tool : undefined;
}

export function getPublishedToolsByCategory(categories: ToolCategory[]) {
  return publishedTools.filter((tool) => categories.includes(tool.category));
}

export function getRelatedPublishedTools(tool: ToolDefinition) {
  return tool.relatedTools
    .map(getPublishedTool)
    .filter((relatedTool): relatedTool is ToolDefinition => Boolean(relatedTool));
}

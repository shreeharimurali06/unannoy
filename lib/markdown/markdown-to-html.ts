export type MarkdownRenderOptions = {
  breaks?: boolean;
  openLinksInNewTab?: boolean;
};

export type MarkdownRenderResult = {
  input: string;
  html: string;
};

type ListState = {
  ordered: boolean;
  items: string[];
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(text: string): string {
  return escapeHtml(text).replace(/`/g, "&#96;");
}

function renderInline(markdown: string, options: MarkdownRenderOptions): string {
  let html = escapeHtml(markdown);
  const target = options.openLinksInNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";

  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s#]*(?:#[^)\s]+)?|#[^)\s]+)\)/g, (_match, label, href) => {
    return `<a href="${escapeAttribute(href)}"${target}>${label}</a>`;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^\*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  html = html.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");

  if (options.breaks) {
    html = html.replace(/\n/g, "<br>");
  }

  return html;
}

function renderParagraph(lines: string[], options: MarkdownRenderOptions): string {
  return `<p>${renderInline(lines.join(options.breaks ? "\n" : " "), options)}</p>`;
}

function renderList(list: ListState, options: MarkdownRenderOptions): string {
  const tag = list.ordered ? "ol" : "ul";
  const items = list.items.map((item) => `<li>${renderInline(item, options)}</li>`).join("");

  return `<${tag}>${items}</${tag}>`;
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\||\|$/g, "");

  return trimmed.split("|").map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const cells = splitTableRow(line);

  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderTable(headerLine: string, separatorLine: string, bodyLines: string[], options: MarkdownRenderOptions): string {
  const headers = splitTableRow(headerLine);
  const alignments = splitTableRow(separatorLine).map((cell) => {
    const left = cell.startsWith(":");
    const right = cell.endsWith(":");

    if (left && right) {
      return "center";
    }

    if (right) {
      return "right";
    }

    return left ? "left" : undefined;
  });
  const headerHtml = headers
    .map((header, index) => {
      const align = alignments[index] ? ` style="text-align: ${alignments[index]}"` : "";

      return `<th${align}>${renderInline(header, options)}</th>`;
    })
    .join("");
  const bodyHtml = bodyLines
    .map((line) => {
      const cells = splitTableRow(line);
      const cellHtml = headers
        .map((_, index) => {
          const align = alignments[index] ? ` style="text-align: ${alignments[index]}"` : "";

          return `<td${align}>${renderInline(cells[index] ?? "", options)}</td>`;
        })
        .join("");

      return `<tr>${cellHtml}</tr>`;
    })
    .join("");

  return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

function flushParagraph(output: string[], paragraph: string[], options: MarkdownRenderOptions): void {
  if (paragraph.length === 0) {
    return;
  }

  output.push(renderParagraph(paragraph, options));
  paragraph.length = 0;
}

function flushList(output: string[], list: ListState | undefined, options: MarkdownRenderOptions): undefined {
  if (list) {
    output.push(renderList(list, options));
  }

  return undefined;
}

export function renderMarkdownToHtml(markdown: string, options: MarkdownRenderOptions = {}): MarkdownRenderResult {
  const normalized = markdown.replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");
  const output: string[] = [];
  const paragraph: string[] = [];
  let list: ListState | undefined;
  let inCodeFence = false;
  let codeFenceLanguage = "";
  let codeLines: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const fenceMatch = line.match(/^```([A-Za-z0-9_-]+)?\s*$/);

    if (fenceMatch) {
      if (inCodeFence) {
        const languageClass = codeFenceLanguage ? ` class="language-${escapeAttribute(codeFenceLanguage)}"` : "";

        output.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        inCodeFence = false;
        codeFenceLanguage = "";
        codeLines = [];
      } else {
        flushParagraph(output, paragraph, options);
        list = flushList(output, list, options);
        inCodeFence = true;
        codeFenceLanguage = fenceMatch[1] ?? "";
      }

      continue;
    }

    if (inCodeFence) {
      codeLines.push(line);
      continue;
    }

    if (line.trim().length === 0) {
      flushParagraph(output, paragraph, options);
      list = flushList(output, list, options);
      continue;
    }

    if (index + 1 < lines.length && line.includes("|") && isTableSeparator(lines[index + 1] ?? "")) {
      const bodyLines: string[] = [];
      let tableIndex = index + 2;

      while (tableIndex < lines.length && (lines[tableIndex] ?? "").includes("|") && (lines[tableIndex] ?? "").trim()) {
        bodyLines.push(lines[tableIndex] ?? "");
        tableIndex += 1;
      }

      flushParagraph(output, paragraph, options);
      list = flushList(output, list, options);
      output.push(renderTable(line, lines[index + 1] ?? "", bodyLines, options));
      index = tableIndex - 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);

    if (headingMatch) {
      const level = headingMatch[1].length;

      flushParagraph(output, paragraph, options);
      list = flushList(output, list, options);
      output.push(`<h${level}>${renderInline(headingMatch[2], options)}</h${level}>`);
      continue;
    }

    const blockquoteMatch = line.match(/^>\s?(.*)$/);

    if (blockquoteMatch) {
      const quoteLines = [blockquoteMatch[1]];
      let quoteIndex = index + 1;

      while (quoteIndex < lines.length) {
        const nextQuote = (lines[quoteIndex] ?? "").match(/^>\s?(.*)$/);

        if (!nextQuote) {
          break;
        }

        quoteLines.push(nextQuote[1]);
        quoteIndex += 1;
      }

      flushParagraph(output, paragraph, options);
      list = flushList(output, list, options);
      output.push(`<blockquote>${renderParagraph(quoteLines, options)}</blockquote>`);
      index = quoteIndex - 1;
      continue;
    }

    const unorderedMatch = line.match(/^\s*[-*+]\s+(.+)$/);
    const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);

    if (unorderedMatch || orderedMatch) {
      const ordered = Boolean(orderedMatch);
      const item = (orderedMatch?.[1] ?? unorderedMatch?.[1] ?? "").trim();

      flushParagraph(output, paragraph, options);

      if (!list || list.ordered !== ordered) {
        list = flushList(output, list, options);
        list = { ordered, items: [] };
      }

      list.items.push(item);
      continue;
    }

    list = flushList(output, list, options);
    paragraph.push(line.trim());
  }

  if (inCodeFence) {
    const languageClass = codeFenceLanguage ? ` class="language-${escapeAttribute(codeFenceLanguage)}"` : "";

    output.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  flushParagraph(output, paragraph, options);
  flushList(output, list, options);

  return {
    input: markdown,
    html: output.join("\n"),
  };
}

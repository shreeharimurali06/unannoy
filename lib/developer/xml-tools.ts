export type XmlToolError = {
  message: string;
  line?: number;
  column?: number;
};

export type XmlToolResult = {
  ok: boolean;
  input: string;
  output: string;
  error?: XmlToolError;
};

type XmlToken =
  | { type: "tag"; raw: string; name: string; closing: boolean; selfClosing: boolean; position: number }
  | { type: "text"; raw: string; position: number };

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

function getLineColumn(text: string, position: number): Pick<XmlToolError, "line" | "column"> {
  const lines = text.slice(0, Math.max(0, position)).split("\n");

  return {
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  };
}

function parseXmlWithDomParser(text: string): XmlToolError | undefined {
  if (typeof DOMParser === "undefined") {
    return undefined;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(text, "application/xml");
  const parserError = document.querySelector("parsererror");

  if (!parserError) {
    return undefined;
  }

  const message = parserError.textContent?.trim() || "Invalid XML";
  const lineMatch = message.match(/line\s+(\d+)/i);
  const columnMatch = message.match(/column\s+(\d+)/i);

  return {
    message,
    line: lineMatch ? Number(lineMatch[1]) : undefined,
    column: columnMatch ? Number(columnMatch[1]) : undefined,
  };
}

function getTagName(rawTag: string): string {
  const match = rawTag.match(/^<\/?\s*([^\s/>]+)/);

  return match?.[1] ?? "";
}

function tokenizeXml(text: string): XmlToken[] {
  const tokens: XmlToken[] = [];
  const tagPattern = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<![^>]*>|<\/?[^>]+>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", raw: text.slice(lastIndex, match.index), position: lastIndex });
    }

    const raw = match[0];
    const isDeclaration = raw.startsWith("<?") || raw.startsWith("<!") || raw.startsWith("<!--");

    if (!isDeclaration) {
      const name = getTagName(raw);
      const lowerName = name.toLocaleLowerCase();

      tokens.push({
        type: "tag",
        raw,
        name,
        closing: /^<\//.test(raw),
        selfClosing: /\/\s*>$/.test(raw) || VOID_TAGS.has(lowerName),
        position: match.index,
      });
    } else {
      tokens.push({ type: "text", raw, position: match.index });
    }

    lastIndex = tagPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", raw: text.slice(lastIndex), position: lastIndex });
  }

  return tokens;
}

function validateXmlStructure(text: string): XmlToolError | undefined {
  const stack: Array<{ name: string; position: number }> = [];
  const tokens = tokenizeXml(text);
  let rootElements = 0;

  for (const token of tokens) {
    if (token.type !== "tag") {
      if (token.raw.trim().length > 0 && (stack.length === 0 || /[<>]/.test(token.raw))) {
        return {
          message: "XML must contain one root element and no malformed tags",
          ...getLineColumn(text, token.position),
        };
      }

      continue;
    }

    if (!token.name) {
      return {
        message: "Invalid XML tag",
        ...getLineColumn(text, token.position),
      };
    }

    if (token.selfClosing) {
      if (stack.length === 0) {
        rootElements += 1;
      }

      continue;
    }

    if (!token.closing) {
      if (stack.length === 0) {
        rootElements += 1;
      }

      stack.push({ name: token.name, position: token.position });
      continue;
    }

    const last = stack.pop();

    if (!last) {
      return {
        message: `Unexpected closing tag </${token.name}>`,
        ...getLineColumn(text, token.position),
      };
    }

    if (last.name !== token.name) {
      return {
        message: `Expected closing tag </${last.name}> but found </${token.name}>`,
        ...getLineColumn(text, token.position),
      };
    }
  }

  const unclosed = stack.pop();

  if (unclosed) {
    return {
      message: `Missing closing tag </${unclosed.name}>`,
      ...getLineColumn(text, unclosed.position),
    };
  }

  if (rootElements !== 1) {
    return {
      message: rootElements === 0 ? "XML must contain a root element" : "XML must contain only one root element",
      ...getLineColumn(text, 0),
    };
  }

  return undefined;
}

function escapeText(text: string): string {
  return text.trim();
}

export function validateXml(text: string): XmlToolResult {
  const normalized = normalizeLineEndings(text);
  const domParserError = parseXmlWithDomParser(normalized);
  const structureError = validateXmlStructure(normalized);
  const error = domParserError ?? structureError;

  if (error) {
    return {
      ok: false,
      input: text,
      output: "",
      error,
    };
  }

  return {
    ok: true,
    input: text,
    output: normalized,
  };
}

export function formatXml(text: string, spaces = 2): XmlToolResult {
  const validation = validateXml(text);

  if (!validation.ok) {
    return validation;
  }

  const indentSize = Math.min(10, Math.max(0, Math.floor(Number.isFinite(spaces) ? spaces : 2)));
  const indent = " ".repeat(indentSize);
  const lines: string[] = [];
  let depth = 0;

  for (const token of tokenizeXml(validation.output)) {
    if (token.type === "text") {
      const content = escapeText(token.raw);

      if (content.length > 0) {
        lines.push(`${indent.repeat(depth)}${content}`);
      }

      continue;
    }

    if (token.closing) {
      depth = Math.max(0, depth - 1);
    }

    lines.push(`${indent.repeat(depth)}${token.raw.trim()}`);

    if (!token.closing && !token.selfClosing) {
      depth += 1;
    }
  }

  return {
    ok: true,
    input: text,
    output: lines.join("\n"),
  };
}

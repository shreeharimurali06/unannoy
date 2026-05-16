export type DuplicateLineComparison = "exact" | "trimmed" | "case-insensitive" | "trimmed-case-insensitive";

export type TextCleanerOptions = {
  normalizeLineEndings?: boolean;
  trimText?: boolean;
  trimLines?: boolean;
  collapseSpaces?: boolean;
  removeTabs?: boolean;
  tabReplacement?: string;
  removeEmptyLines?: boolean;
  collapseBlankLines?: boolean;
  removeDuplicateLines?: boolean;
  duplicateLineComparison?: DuplicateLineComparison;
  stripZeroWidthCharacters?: boolean;
  stripControlCharacters?: boolean;
};

export type ResolvedTextCleanerOptions = Required<TextCleanerOptions>;

export type TextCleanerSummary = {
  charactersBefore: number;
  charactersAfter: number;
  charactersRemoved: number;
  wordsBefore: number;
  wordsAfter: number;
  linesBefore: number;
  linesAfter: number;
  emptyLinesRemoved: number;
  duplicateLinesRemoved: number;
  changed: boolean;
};

export type TextCleanerResult = {
  original: string;
  cleaned: string;
  options: ResolvedTextCleanerOptions;
  summary: TextCleanerSummary;
};

export const defaultTextCleanerOptions: ResolvedTextCleanerOptions = {
  normalizeLineEndings: true,
  trimText: true,
  trimLines: true,
  collapseSpaces: true,
  removeTabs: true,
  tabReplacement: " ",
  removeEmptyLines: false,
  collapseBlankLines: true,
  removeDuplicateLines: false,
  duplicateLineComparison: "trimmed",
  stripZeroWidthCharacters: true,
  stripControlCharacters: false,
};

const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

function resolveOptions(options: TextCleanerOptions): ResolvedTextCleanerOptions {
  return {
    ...defaultTextCleanerOptions,
    ...options,
    tabReplacement: options.tabReplacement ?? defaultTextCleanerOptions.tabReplacement,
  };
}

function countWords(text: string): number {
  return text.match(WORD_PATTERN)?.length ?? 0;
}

function countLines(text: string): number {
  if (text.length === 0) {
    return 0;
  }

  return text.split("\n").length;
}

function getDuplicateKey(line: string, comparison: DuplicateLineComparison): string {
  switch (comparison) {
    case "exact":
      return line;
    case "trimmed":
      return line.trim();
    case "case-insensitive":
      return line.toLocaleLowerCase();
    case "trimmed-case-insensitive":
      return line.trim().toLocaleLowerCase();
  }
}

function removeDuplicateLines(lines: string[], comparison: DuplicateLineComparison): {
  lines: string[];
  removed: number;
} {
  const seen = new Set<string>();
  const kept: string[] = [];
  let removed = 0;

  for (const line of lines) {
    const key = getDuplicateKey(line, comparison);

    if (seen.has(key)) {
      removed += 1;
      continue;
    }

    seen.add(key);
    kept.push(line);
  }

  return { lines: kept, removed };
}

export function cleanText(text: string, options: TextCleanerOptions = {}): TextCleanerResult {
  const resolvedOptions = resolveOptions(options);
  const original = text;
  const originalLines = resolvedOptions.normalizeLineEndings ? text.replace(/\r\n?/g, "\n") : text;
  let cleaned = originalLines;

  if (resolvedOptions.stripZeroWidthCharacters) {
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");
  }

  if (resolvedOptions.stripControlCharacters) {
    cleaned = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  }

  if (resolvedOptions.removeTabs) {
    cleaned = cleaned.replace(/\t/g, resolvedOptions.tabReplacement);
  }

  let lines = cleaned.split("\n");

  if (resolvedOptions.trimLines) {
    lines = lines.map((line) => line.trim());
  }

  if (resolvedOptions.collapseSpaces) {
    lines = lines.map((line) => line.replace(/[ ]{2,}/g, " "));
  }

  const emptyLinesBefore = lines.filter((line) => line.trim().length === 0).length;

  if (resolvedOptions.removeEmptyLines) {
    lines = lines.filter((line) => line.trim().length > 0);
  } else if (resolvedOptions.collapseBlankLines) {
    const collapsedLines: string[] = [];
    let previousWasBlank = false;

    for (const line of lines) {
      const isBlank = line.trim().length === 0;

      if (isBlank && previousWasBlank) {
        continue;
      }

      collapsedLines.push(line);
      previousWasBlank = isBlank;
    }

    lines = collapsedLines;
  }

  const emptyLinesAfter = lines.filter((line) => line.trim().length === 0).length;
  let duplicateLinesRemoved = 0;

  if (resolvedOptions.removeDuplicateLines) {
    const deduped = removeDuplicateLines(lines, resolvedOptions.duplicateLineComparison);
    lines = deduped.lines;
    duplicateLinesRemoved = deduped.removed;
  }

  cleaned = lines.join("\n");

  if (resolvedOptions.trimText) {
    cleaned = cleaned.trim();
  }

  return {
    original,
    cleaned,
    options: resolvedOptions,
    summary: {
      charactersBefore: original.length,
      charactersAfter: cleaned.length,
      charactersRemoved: Math.max(0, original.length - cleaned.length),
      wordsBefore: countWords(original),
      wordsAfter: countWords(cleaned),
      linesBefore: countLines(originalLines),
      linesAfter: countLines(cleaned),
      emptyLinesRemoved: Math.max(0, emptyLinesBefore - emptyLinesAfter),
      duplicateLinesRemoved,
      changed: original !== cleaned,
    },
  };
}

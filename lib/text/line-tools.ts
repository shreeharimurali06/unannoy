export type DuplicateLineComparison = "exact" | "trimmed" | "case-insensitive" | "trimmed-case-insensitive";

export type DuplicateLineOptions = {
  comparison?: DuplicateLineComparison;
  removeEmptyLines?: boolean;
  keepFirst?: boolean;
};

export type DuplicateLineResult = {
  input: string;
  output: string;
  linesBefore: number;
  linesAfter: number;
  duplicatesRemoved: number;
  emptyLinesRemoved: number;
  changed: boolean;
};

export type SortLineDirection = "ascending" | "descending";

export type SortLineOptions = {
  direction?: SortLineDirection;
  caseSensitive?: boolean;
  numeric?: boolean;
  trimBeforeCompare?: boolean;
  removeEmptyLines?: boolean;
  locale?: string;
};

export type SortLinesResult = {
  input: string;
  output: string;
  linesBefore: number;
  linesAfter: number;
  changed: boolean;
};

export type LineMetrics = {
  totalLines: number;
  nonEmptyLines: number;
  emptyLines: number;
  blankLines: number;
  duplicateLines: number;
  shortestLineLength: number;
  longestLineLength: number;
  averageLineLength: number;
  medianLineLength: number;
  totalCharacters: number;
  totalCharactersWithoutLineBreaks: number;
};

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

function splitLines(text: string): string[] {
  if (text.length === 0) {
    return [];
  }

  return normalizeLineEndings(text).split("\n");
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

export function removeDuplicateLines(text: string, options: DuplicateLineOptions = {}): DuplicateLineResult {
  const comparison = options.comparison ?? "exact";
  const keepFirst = options.keepFirst ?? true;
  const lines = splitLines(text);
  const indexes = keepFirst ? lines.keys() : lines.map((_, index) => index).reverse();
  const seen = new Set<string>();
  const keptIndexes = new Set<number>();
  let duplicatesRemoved = 0;
  let emptyLinesRemoved = 0;

  for (const index of indexes) {
    const line = lines[index] ?? "";

    if (options.removeEmptyLines && line.trim().length === 0) {
      emptyLinesRemoved += 1;
      continue;
    }

    const key = getDuplicateKey(line, comparison);

    if (seen.has(key)) {
      duplicatesRemoved += 1;
      continue;
    }

    seen.add(key);
    keptIndexes.add(index);
  }

  const output = lines.filter((_, index) => keptIndexes.has(index)).join("\n");

  return {
    input: text,
    output,
    linesBefore: lines.length,
    linesAfter: output.length === 0 ? 0 : output.split("\n").length,
    duplicatesRemoved,
    emptyLinesRemoved,
    changed: normalizeLineEndings(text) !== output,
  };
}

export function sortLines(text: string, options: SortLineOptions = {}): SortLinesResult {
  const direction = options.direction ?? "ascending";
  const lines = splitLines(text);
  const sortableLines = options.removeEmptyLines ? lines.filter((line) => line.trim().length > 0) : [...lines];
  const collator = new Intl.Collator(options.locale, {
    sensitivity: options.caseSensitive ? "variant" : "base",
    numeric: options.numeric ?? true,
  });

  sortableLines.sort((left, right) => {
    const leftValue = options.trimBeforeCompare ? left.trim() : left;
    const rightValue = options.trimBeforeCompare ? right.trim() : right;
    const result = collator.compare(leftValue, rightValue);

    return direction === "ascending" ? result : -result;
  });

  const output = sortableLines.join("\n");

  return {
    input: text,
    output,
    linesBefore: lines.length,
    linesAfter: sortableLines.length,
    changed: normalizeLineEndings(text) !== output,
  };
}

export function getLineMetrics(text: string): LineMetrics {
  const normalized = normalizeLineEndings(text);
  const lines = splitLines(text);
  const lengths = lines.map((line) => line.length);
  const sortedLengths = [...lengths].sort((left, right) => left - right);
  const middle = Math.floor(sortedLengths.length / 2);
  const medianLineLength =
    sortedLengths.length === 0
      ? 0
      : sortedLengths.length % 2 === 0
        ? ((sortedLengths[middle - 1] ?? 0) + (sortedLengths[middle] ?? 0)) / 2
        : (sortedLengths[middle] ?? 0);
  const seen = new Set<string>();
  let duplicateLines = 0;

  for (const line of lines) {
    if (seen.has(line)) {
      duplicateLines += 1;
    } else {
      seen.add(line);
    }
  }

  return {
    totalLines: lines.length,
    nonEmptyLines: lines.filter((line) => line.length > 0).length,
    emptyLines: lines.filter((line) => line.length === 0).length,
    blankLines: lines.filter((line) => line.trim().length === 0).length,
    duplicateLines,
    shortestLineLength: sortedLengths[0] ?? 0,
    longestLineLength: sortedLengths.at(-1) ?? 0,
    averageLineLength: lengths.length > 0 ? lengths.reduce((total, length) => total + length, 0) / lengths.length : 0,
    medianLineLength,
    totalCharacters: text.length,
    totalCharactersWithoutLineBreaks: normalized.replace(/\n/g, "").length,
  };
}

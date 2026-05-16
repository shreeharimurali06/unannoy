import { getWords } from "./word-count";

export type CharacterLimitMode = "characters" | "charactersWithoutSpaces" | "charactersWithoutWhitespace";

export type CharacterLimitStatus = "empty" | "under" | "at" | "over";

export type CharacterCountMetrics = {
  characters: number;
  charactersWithoutSpaces: number;
  charactersWithoutWhitespace: number;
  letters: number;
  numbers: number;
  punctuation: number;
  symbols: number;
  spaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  bytes: number;
};

export type CharacterLimitResult = {
  limit: number;
  mode: CharacterLimitMode;
  used: number;
  remaining: number;
  percentUsed: number;
  isOverLimit: boolean;
  status: CharacterLimitStatus;
};

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

function countLines(text: string): number {
  if (text.length === 0) {
    return 0;
  }

  return text.split(/\r\n|\r|\n/).length;
}

function countParagraphs(text: string): number {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return 0;
  }

  return trimmed.split(/(?:\r\n|\r|\n)\s*(?:\r\n|\r|\n)+/).filter(Boolean).length;
}

function countBytes(text: string): number {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(text).length;
  }

  return Buffer.byteLength(text, "utf8");
}

export function getCharacterCountMetrics(text: string): CharacterCountMetrics {
  return {
    characters: text.length,
    charactersWithoutSpaces: text.replace(/ /g, "").length,
    charactersWithoutWhitespace: text.replace(/\s/g, "").length,
    letters: countMatches(text, /\p{L}/gu),
    numbers: countMatches(text, /\p{N}/gu),
    punctuation: countMatches(text, /\p{P}/gu),
    symbols: countMatches(text, /\p{S}/gu),
    spaces: countMatches(text, / /g),
    words: getWords(text).length,
    lines: countLines(text),
    paragraphs: countParagraphs(text),
    bytes: countBytes(text),
  };
}

export function checkCharacterLimit(
  text: string,
  limit: number,
  mode: CharacterLimitMode = "characters",
): CharacterLimitResult {
  const metrics = getCharacterCountMetrics(text);
  const normalizedLimit = Math.max(0, Math.floor(Number.isFinite(limit) ? limit : 0));
  const used = metrics[mode];
  const remaining = normalizedLimit - used;
  const percentUsed = normalizedLimit > 0 ? (used / normalizedLimit) * 100 : 0;
  const isOverLimit = used > normalizedLimit;
  const status: CharacterLimitStatus =
    used === 0 ? "empty" : isOverLimit ? "over" : used === normalizedLimit ? "at" : "under";

  return {
    limit: normalizedLimit,
    mode,
    used,
    remaining,
    percentUsed,
    isOverLimit,
    status,
  };
}

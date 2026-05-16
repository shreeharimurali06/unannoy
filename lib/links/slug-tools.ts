export type SlugSeparator = "-" | "_";

export type SlugOptions = {
  lowercase: boolean;
  removeStopWords: boolean;
  separator: SlugSeparator;
  maxLength: number;
  removeSpecialCharacters: boolean;
};

export type SlugResult = {
  slug: string;
  wordsBefore: number;
  wordsAfter: number;
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clipSlug(slug: string, maxLength: number, separator: SlugSeparator) {
  const limit = Math.max(0, Math.min(240, Math.round(maxLength)));
  if (!limit || slug.length <= limit) return slug;

  const clipped = slug.slice(0, limit);
  const lastSeparator = clipped.lastIndexOf(separator);
  const trailingSeparator = new RegExp(`${escapeRegExp(separator)}+$`);

  if (lastSeparator > 12) {
    return clipped.slice(0, lastSeparator).replace(trailingSeparator, "");
  }

  return clipped.replace(trailingSeparator, "");
}

export function generateSlug(input: string, options: SlugOptions): SlugResult {
  const normalized = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "");
  const wordsBefore = normalized.trim() ? normalized.trim().split(/\s+/).length : 0;
  const specialPattern = options.removeSpecialCharacters ? /[^A-Za-z0-9\s_-]+/g : /[^\p{L}\p{N}\s_-]+/gu;
  const cleaned = normalized.replace(specialPattern, " ");
  const words = cleaned
    .split(/[\s_-]+/)
    .map((word) => (options.lowercase ? word.toLowerCase() : word))
    .filter(Boolean)
    .filter((word) => !options.removeStopWords || !stopWords.has(word.toLowerCase()));

  return {
    slug: clipSlug(words.join(options.separator), options.maxLength, options.separator),
    wordsBefore,
    wordsAfter: words.length,
  };
}


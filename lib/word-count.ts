export type WordCountOptions = {
  readingWordsPerMinute?: number;
  speakingWordsPerMinute?: number;
};

export type WordCountMetrics = {
  characters: number;
  charactersWithoutSpaces: number;
  charactersWithoutWhitespace: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  readingTimeLabel: string;
  speakingTimeLabel: string;
  averageWordLength: number;
  longestWordLength: number;
};

const DEFAULT_READING_WORDS_PER_MINUTE = 200;
const DEFAULT_SPEAKING_WORDS_PER_MINUTE = 130;
const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

function clampWordsPerMinute(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
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

function countSentences(text: string): number {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return 0;
  }

  const matches = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);

  return matches?.filter((sentence) => sentence.trim().length > 0).length ?? 0;
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) {
    return "0 min";
  }

  if (minutes < 1) {
    return "< 1 min";
  }

  const wholeMinutes = Math.floor(minutes);
  const seconds = Math.round((minutes - wholeMinutes) * 60);

  if (wholeMinutes < 60) {
    return seconds > 0 ? `${wholeMinutes} min ${seconds} sec` : `${wholeMinutes} min`;
  }

  const hours = Math.floor(wholeMinutes / 60);
  const remainingMinutes = wholeMinutes % 60;

  return remainingMinutes > 0 ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
}

export function getWords(text: string): string[] {
  return text.match(WORD_PATTERN) ?? [];
}

export function getWordCountMetrics(text: string, options: WordCountOptions = {}): WordCountMetrics {
  const words = getWords(text);
  const wordCount = words.length;
  const totalWordCharacters = words.reduce((total, word) => total + word.length, 0);
  const readingWordsPerMinute = clampWordsPerMinute(
    options.readingWordsPerMinute,
    DEFAULT_READING_WORDS_PER_MINUTE,
  );
  const speakingWordsPerMinute = clampWordsPerMinute(
    options.speakingWordsPerMinute,
    DEFAULT_SPEAKING_WORDS_PER_MINUTE,
  );
  const readingTimeMinutes = wordCount / readingWordsPerMinute;
  const speakingTimeMinutes = wordCount / speakingWordsPerMinute;

  return {
    characters: text.length,
    charactersWithoutSpaces: text.replace(/ /g, "").length,
    charactersWithoutWhitespace: text.replace(/\s/g, "").length,
    words: wordCount,
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    lines: countLines(text),
    readingTimeMinutes,
    speakingTimeMinutes,
    readingTimeLabel: formatDuration(readingTimeMinutes),
    speakingTimeLabel: formatDuration(speakingTimeMinutes),
    averageWordLength: wordCount > 0 ? totalWordCharacters / wordCount : 0,
    longestWordLength: words.reduce((longest, word) => Math.max(longest, word.length), 0),
  };
}

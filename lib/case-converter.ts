export type CaseConversion =
  | "uppercase"
  | "lowercase"
  | "sentence"
  | "title"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "slug";

export type CaseConversionResult = {
  input: string;
  output: string;
  conversion: CaseConversion;
  changed: boolean;
};

const SMALL_TITLE_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "per",
  "the",
  "to",
  "vs",
  "via",
  "with",
]);

function stripDiacritics(text: string): string {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function getWords(text: string): string[] {
  return stripDiacritics(text).match(/[\p{L}\p{N}]+/gu) ?? [];
}

function capitalizeWord(word: string): string {
  if (word.length === 0) {
    return word;
  }

  return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();
}

function toSentenceCase(text: string): string {
  let shouldCapitalize = true;

  return text
    .toLocaleLowerCase()
    .replace(/\p{L}/gu, (letter) => {
      if (!shouldCapitalize) {
        return letter;
      }

      shouldCapitalize = false;
      return letter.toLocaleUpperCase();
    })
    .replace(/[.!?]\s*/g, (ending) => {
      shouldCapitalize = true;
      return ending;
    });
}

function toTitleCase(text: string): string {
  const tokens = text.toLocaleLowerCase().match(/[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu) ?? [];
  const wordIndexes = tokens
    .map((token, index) => (/^[\p{L}\p{N}]+$/u.test(token) ? index : -1))
    .filter((index) => index >= 0);
  const firstWordIndex = wordIndexes[0];
  const lastWordIndex = wordIndexes.at(-1);

  return tokens
    .map((token, index) => {
      if (!/^[\p{L}\p{N}]+$/u.test(token)) {
        return token;
      }

      if (index !== firstWordIndex && index !== lastWordIndex && SMALL_TITLE_WORDS.has(token)) {
        return token;
      }

      return capitalizeWord(token);
    })
    .join("");
}

function toDelimitedCase(text: string, delimiter: "-" | "_"): string {
  return getWords(text)
    .map((word) => word.toLocaleLowerCase())
    .join(delimiter);
}

function toCamelLikeCase(text: string, capitalizeFirstWord: boolean): string {
  return getWords(text)
    .map((word, index) => {
      const normalized = word.toLocaleLowerCase();

      if (index === 0 && !capitalizeFirstWord) {
        return normalized;
      }

      return capitalizeWord(normalized);
    })
    .join("");
}

function toSlugCase(text: string): string {
  return stripDiacritics(text)
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function convertCase(input: string, conversion: CaseConversion): CaseConversionResult {
  const output = (() => {
    switch (conversion) {
      case "uppercase":
        return input.toLocaleUpperCase();
      case "lowercase":
        return input.toLocaleLowerCase();
      case "sentence":
        return toSentenceCase(input);
      case "title":
        return toTitleCase(input);
      case "camel":
        return toCamelLikeCase(input, false);
      case "pascal":
        return toCamelLikeCase(input, true);
      case "snake":
        return toDelimitedCase(input, "_");
      case "kebab":
        return toDelimitedCase(input, "-");
      case "slug":
        return toSlugCase(input);
    }
  })();

  return {
    input,
    output,
    conversion,
    changed: input !== output,
  };
}

export type ListCleanerSort = "none" | "ascending" | "descending";

export type ListCleanerOptions = {
  delimiter?: string | RegExp;
  outputDelimiter?: string;
  trimItems?: boolean;
  removeEmptyItems?: boolean;
  removeDuplicates?: boolean;
  caseInsensitiveDuplicates?: boolean;
  sort?: ListCleanerSort;
  caseSensitiveSort?: boolean;
};

export type ListCleanerResult = {
  input: string;
  output: string;
  itemsBefore: number;
  itemsAfter: number;
  emptyItemsRemoved: number;
  duplicatesRemoved: number;
  changed: boolean;
};

function splitItems(text: string, delimiter: string | RegExp): string[] {
  if (text.length === 0) {
    return [];
  }

  return text.split(delimiter);
}

export function cleanList(text: string, options: ListCleanerOptions = {}): ListCleanerResult {
  const delimiter = options.delimiter ?? /\r\n|\r|\n|,/;
  const outputDelimiter = options.outputDelimiter ?? "\n";
  let items = splitItems(text, delimiter);
  const itemsBefore = items.length;
  let emptyItemsRemoved = 0;
  let duplicatesRemoved = 0;

  if (options.trimItems ?? true) {
    items = items.map((item) => item.trim());
  }

  if (options.removeEmptyItems ?? true) {
    const before = items.length;
    items = items.filter((item) => item.length > 0);
    emptyItemsRemoved = before - items.length;
  }

  if (options.removeDuplicates ?? true) {
    const seen = new Set<string>();
    const deduped: string[] = [];

    for (const item of items) {
      const key = options.caseInsensitiveDuplicates ? item.toLocaleLowerCase() : item;

      if (seen.has(key)) {
        duplicatesRemoved += 1;
        continue;
      }

      seen.add(key);
      deduped.push(item);
    }

    items = deduped;
  }

  const sort = options.sort ?? "none";

  if (sort !== "none") {
    const collator = new Intl.Collator(undefined, {
      sensitivity: options.caseSensitiveSort ? "variant" : "base",
      numeric: true,
    });

    items = [...items].sort((left, right) => {
      const result = collator.compare(left, right);

      return sort === "ascending" ? result : -result;
    });
  }

  const output = items.join(outputDelimiter);

  return {
    input: text,
    output,
    itemsBefore,
    itemsAfter: items.length,
    emptyItemsRemoved,
    duplicatesRemoved,
    changed: text !== output,
  };
}

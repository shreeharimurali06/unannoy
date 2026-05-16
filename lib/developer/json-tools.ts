export type JsonToolError = {
  message: string;
  line?: number;
  column?: number;
  position?: number;
};

export type JsonToolResult = {
  ok: boolean;
  input: string;
  output: string;
  error?: JsonToolError;
};

function getLineColumnFromPosition(text: string, position: number): Pick<JsonToolError, "line" | "column" | "position"> {
  const before = text.slice(0, Math.max(0, position));
  const lines = before.split(/\r\n|\r|\n/);

  return {
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
    position,
  };
}

function getJsonError(text: string, error: unknown): JsonToolError {
  const message = error instanceof Error ? error.message : "Invalid JSON";
  const positionMatch = message.match(/position\s+(\d+)/i);

  if (!positionMatch) {
    return { message };
  }

  return {
    message,
    ...getLineColumnFromPosition(text, Number(positionMatch[1])),
  };
}

export function validateJson(text: string): JsonToolResult {
  try {
    JSON.parse(text);

    return {
      ok: true,
      input: text,
      output: text,
    };
  } catch (error) {
    return {
      ok: false,
      input: text,
      output: "",
      error: getJsonError(text, error),
    };
  }
}

export function formatJson(text: string, spaces = 2): JsonToolResult {
  try {
    const parsed: unknown = JSON.parse(text);
    const indent = Math.min(10, Math.max(0, Math.floor(Number.isFinite(spaces) ? spaces : 2)));

    return {
      ok: true,
      input: text,
      output: JSON.stringify(parsed, null, indent),
    };
  } catch (error) {
    return {
      ok: false,
      input: text,
      output: "",
      error: getJsonError(text, error),
    };
  }
}

export function minifyJson(text: string): JsonToolResult {
  try {
    const parsed: unknown = JSON.parse(text);

    return {
      ok: true,
      input: text,
      output: JSON.stringify(parsed),
    };
  } catch (error) {
    return {
      ok: false,
      input: text,
      output: "",
      error: getJsonError(text, error),
    };
  }
}

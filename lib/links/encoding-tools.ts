export type UrlEncodeMode = "component" | "full-url";
export type UrlEncodingAction = "encode" | "decode";

export type UrlEncodingResult = {
  ok: boolean;
  output: string;
  error?: string;
};

function encodeFullUrl(input: string) {
  try {
    const parsed = new URL(input.trim());
    return parsed.href;
  } catch {
    return encodeURI(input);
  }
}

export function transformUrlEncoding(input: string, action: UrlEncodingAction, mode: UrlEncodeMode): UrlEncodingResult {
  if (!input) {
    return { ok: true, output: "" };
  }

  try {
    if (action === "encode") {
      return {
        ok: true,
        output: mode === "component" ? encodeURIComponent(input) : encodeFullUrl(input),
      };
    }

    return {
      ok: true,
      output: mode === "component" ? decodeURIComponent(input) : decodeURI(input),
    };
  } catch {
    return {
      ok: false,
      output: "",
      error: "That encoded text has a broken percent escape. One tiny % is causing drama.",
    };
  }
}


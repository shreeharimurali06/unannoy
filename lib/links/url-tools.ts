export const UTM_PARAMETERS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export const KNOWN_TRACKING_PARAMETERS = [
  ...UTM_PARAMETERS,
  "fbclid",
  "gclid",
  "msclkid",
  "ref",
  "ref_src",
  "igshid",
  "mc_cid",
  "mc_eid",
  "yclid",
  "twclid",
] as const;

export type UrlCleanMode = "utm-only" | "known-trackers";

export type UrlCleanOptions = {
  mode?: UrlCleanMode;
  removeHash?: boolean;
};

export type RemovedUrlParameter = {
  name: string;
  value: string;
};

export type UrlCleanResult = {
  ok: boolean;
  originalUrl: string;
  cleanedUrl: string;
  removedParameters: RemovedUrlParameter[];
  error?: string;
};

const trackingParameterSet = new Set<string>(KNOWN_TRACKING_PARAMETERS);
const utmParameterSet = new Set<string>(UTM_PARAMETERS);

function normalizeUrlInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getParameterSet(mode: UrlCleanMode) {
  return mode === "utm-only" ? utmParameterSet : trackingParameterSet;
}

export function cleanUrl(input: string, options: UrlCleanOptions = {}): UrlCleanResult {
  const normalized = normalizeUrlInput(input);

  if (!normalized) {
    return {
      ok: true,
      originalUrl: "",
      cleanedUrl: "",
      removedParameters: [],
    };
  }

  try {
    const url = new URL(normalized);
    const removeSet = getParameterSet(options.mode ?? "known-trackers");
    const removedParameters: RemovedUrlParameter[] = [];

    for (const [name, value] of Array.from(url.searchParams.entries())) {
      if (removeSet.has(name.toLowerCase())) {
        removedParameters.push({ name, value });
        url.searchParams.delete(name);
      }
    }

    if (options.removeHash) {
      url.hash = "";
    }

    return {
      ok: true,
      originalUrl: normalized,
      cleanedUrl: url.href,
      removedParameters,
    };
  } catch {
    return {
      ok: false,
      originalUrl: input.trim(),
      cleanedUrl: "",
      removedParameters: [],
      error: "That does not look like a valid URL yet. Add the full link and try again.",
    };
  }
}

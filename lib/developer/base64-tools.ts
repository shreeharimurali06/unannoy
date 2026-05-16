export type Base64Action = "encode" | "decode";

export type Base64Result = {
  ok: boolean;
  output: string;
  error?: string;
};

function bytesToBinary(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return binary;
}

function binaryToBytes(binary: string) {
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function transformBase64(input: string, action: Base64Action): Base64Result {
  if (!input) {
    return { ok: true, output: "" };
  }

  try {
    if (action === "encode") {
      const bytes = new TextEncoder().encode(input);
      return { ok: true, output: btoa(bytesToBinary(bytes)) };
    }

    const cleaned = input.replace(/\s+/g, "");
    const binary = atob(cleaned);
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(binaryToBytes(binary));
    return { ok: true, output: decoded };
  } catch {
    return {
      ok: false,
      output: "",
      error: "That is not valid Base64 text. The alphabet soup has a typo.",
    };
  }
}


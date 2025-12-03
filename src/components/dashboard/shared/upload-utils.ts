/**
 * Shared utilities for file upload and prompt parsing.
 */

export const MAX_FILE_BYTES = 20_000_000; // 20 MB

/** Centralized error messages */
export const UPLOAD_ERRORS = {
  FILE_TOO_LARGE: "File troppo grande. Max 20 MB",
  READ_ERROR: "Errore durante la lettura del file.",
  SERVER_ERROR: "Errore dal server durante l'upload.",
  INVALID_TYPE: "Formato file non supportato. Usa file di testo (.txt).",
} as const;

/** Safe trim to string */
export const trimValue = (v: unknown): string => String(v ?? "").trim();

/** Map text lines to prompt strings (trimmed, non-empty). */
export const mapLinesToPrompts = (lines: string[]): string[] =>
  lines.map((l) => String(l ?? "").trim()).filter((s) => s !== "");

/** Check if the file looks like a plain text file by extension or mime. */
export const isTextFile = (file: File): boolean => {
  const name = file.name || "";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "txt") return true;
  const mime = file.type || "";
  return mime.startsWith("text/") || mime.includes("plain");
};

/** Parse a plain text File by reading lines. Trims values and skips empty lines. */
export const parseFile = async (file: File): Promise<string[]> => {
  try {
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => trimValue(l));
    return mapLinesToPrompts(lines);
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err));
  }
};

/**
 * Shared utilities for file upload and prompt parsing.
 */

import i18n from "i18next";

export const MAX_FILE_BYTES = 20_000_000; // 20 MB

/** Get localized error messages */
export const getUploadErrors = () => {
  return {
    FILE_TOO_LARGE: i18n.t("upload.errors.fileTooLarge", { ns: "dashboard" }),
    READ_ERROR: i18n.t("upload.errors.readError", { ns: "dashboard" }),
    SERVER_ERROR: i18n.t("upload.errors.serverError", { ns: "dashboard" }),
    INVALID_TYPE: i18n.t("upload.errors.invalidType", { ns: "dashboard" }),
  };
};

/** Fallback error messages (for non-React contexts where i18n may not be initialized) */
export const UPLOAD_ERRORS = {
  FILE_TOO_LARGE: "File too large. Max 20 MB",
  READ_ERROR: "Error reading the file.",
  SERVER_ERROR: "Server error during upload.",
  INVALID_TYPE: "Unsupported file format. Use text files (.txt).",
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

/** Detect if there are any duplicate prompts */
export const hasDuplicates = (prompts: string[]): boolean => {
  const seen = new Set<string>();

  for (const prompt of prompts) {
    const key = prompt.toLowerCase();
    if (seen.has(key)) {
      return true; // Found duplicate, return early
    }
    seen.add(key);
  }

  return false; // No duplicates found
};

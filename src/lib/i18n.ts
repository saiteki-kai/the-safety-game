import { getRelativeLocaleUrl } from "astro:i18n";

// TEMPORARY: Force Italian locale
const FORCED_LOCALE = "it";

/**
 * Return a path prefixed with the forced locale (`/it`).
 * - Accepts paths with or without leading slash.
 * - Avoids double-prefixing if `/it` is already present.
 */
export function localizeUrl(path: string): string {
  if (!path) return `/${FORCED_LOCALE}`;
  // Normalize
  let p = path.startsWith("/") ? path : `/${path}`;
  // If already prefixed with the forced locale, return as-is
  if (p === `/${FORCED_LOCALE}` || p.startsWith(`/${FORCED_LOCALE}/`)) return p;
  // Use astro helper where available for consistency, but fall back to simple join
  try {
    return getRelativeLocaleUrl(FORCED_LOCALE, p);
  } catch (_e) {
    return `/${FORCED_LOCALE}${p}`;
  }
}

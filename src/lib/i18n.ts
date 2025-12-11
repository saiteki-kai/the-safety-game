import { getRelativeLocaleUrl } from "astro:i18n";
import type { Locale } from "./translations";
import { DEFAULT_LOCALE } from "./translations";

/**
 * Return a path prefixed with the specified locale (defaults to Italian).
 * - Accepts paths with or without leading slash.
 * - Avoids double-prefixing if locale is already present.
 */
export function localizeUrl(path: string, locale: Locale = DEFAULT_LOCALE): string {
  if (!path) return `/${locale}`;
  // Normalize
  let p = path.startsWith("/") ? path : `/${path}`;
  // If already prefixed with any locale, return as-is
  if (p === `/${locale}` || p.startsWith(`/${locale}/`)) return p;
  // Use astro helper where available for consistency
  try {
    return getRelativeLocaleUrl(locale, p);
  } catch (_e) {
    return `/${locale}${p}`;
  }
}

/**
 * Extract locale from a URL path.
 */
export function getLocaleFromPath(path: string): Locale {
  const segments = path.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === "it" || firstSegment === "en") {
    return firstSegment as Locale;
  }
  return DEFAULT_LOCALE;
}

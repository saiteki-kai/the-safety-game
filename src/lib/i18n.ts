import { getRelativeLocaleUrl } from "astro:i18n";

// TEMPORARY: Force Italian locale
const FORCED_LOCALE = "it";

export function localizeUrl(path: string): string {
  return getRelativeLocaleUrl(FORCED_LOCALE, path);
}

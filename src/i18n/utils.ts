import { getRelativeLocaleUrl } from "astro:i18n";
import i18next from "i18next";

export function localizeUrl(path: string): string {
  return getRelativeLocaleUrl(i18next.language, path);
}

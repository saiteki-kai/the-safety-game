import { getRelativeLocaleUrl } from "astro:i18n";
import i18next from "i18next";

export function localizeUrl(path: string): string {
  console.log("Localizing URL:", path, "for locale:", i18next.language);
  return getRelativeLocaleUrl(i18next.language, path);
}

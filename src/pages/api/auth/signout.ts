import type { APIContext, APIRoute } from "astro";
import { localizeUrl, getLocaleFromPath } from "@/lib/i18n";
import type { Locale } from "@/lib/translations";

export const GET: APIRoute = async (context: APIContext) => {
  await context.locals.db.auth.signOut();
  const localeParam = new URL(context.request.url).searchParams.get("locale") as Locale | null;
  const locale = (localeParam ?? getLocaleFromPath(new URL(context.request.url).pathname)) as Locale;
  return context.redirect(localizeUrl("/login", locale));
};

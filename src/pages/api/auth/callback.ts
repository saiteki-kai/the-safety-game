import type { APIContext, APIRoute } from "astro";
import { localizeUrl, getLocaleFromPath } from "@/lib/i18n";
import type { Locale } from "@/lib/translations";

export const GET: APIRoute = async (context: APIContext): Promise<Response> => {
  const authCode = context.url.searchParams.get("code");
  const localeParam = context.url.searchParams.get("locale");
  const locale = (localeParam as Locale) ?? getLocaleFromPath(context.url.pathname);

  if (!authCode) {
    return context.redirect(localizeUrl("/home", locale));
  }

  const { data, error } = await context.locals.db.auth.exchangeCodeForSession(authCode);

  if (error || !data.session) {
    return context.redirect(localizeUrl("/login", locale));
  }
  return context.redirect(localizeUrl("/dashboard", locale));
};

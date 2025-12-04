export const prerender = false;

import type { APIContext, APIRoute } from "astro";
import { getRelativeLocaleUrl } from "astro:i18n";

export const GET: APIRoute = async (context: APIContext): Promise<Response> => {
  const authCode = context.url.searchParams.get("code");

  if (!authCode) {
    return context.redirect(getRelativeLocaleUrl(context.currentLocale, "/home"));
  }

  const { data, error } = await context.locals.db.auth.exchangeCodeForSession(authCode);

  if (error || !data.session) {
    return context.redirect(getRelativeLocaleUrl(context.currentLocale, "/login"));
  }

  return context.redirect(getRelativeLocaleUrl(context.currentLocale, "/dashboard"));
};

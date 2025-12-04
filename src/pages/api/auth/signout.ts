export const prerender = false;

import type { APIContext, APIRoute } from "astro";
import { getRelativeLocaleUrl } from "astro:i18n";

export const GET: APIRoute = async (context: APIContext) => {
  await context.locals.db.auth.signOut();

  return context.redirect(getRelativeLocaleUrl(context.currentLocale, "/login"));
};

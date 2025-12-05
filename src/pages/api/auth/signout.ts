export const prerender = false;

import type { APIContext, APIRoute } from "astro";
import { localizeUrl } from "@/i18n/utils";

export const GET: APIRoute = async (context: APIContext) => {
  await context.locals.db.auth.signOut();

  return context.redirect(localizeUrl("/login"));
};

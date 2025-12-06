import type { APIContext, APIRoute } from "astro";
import { localizeUrl } from "@/lib/i18n";

export const GET: APIRoute = async (context: APIContext) => {
  await context.locals.db.auth.signOut();

  return context.redirect(localizeUrl("/login"));
};

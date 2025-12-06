import type { APIContext, APIRoute } from "astro";
import { localizeUrl } from "@/lib/i18n";

export const GET: APIRoute = async (context: APIContext): Promise<Response> => {
  const authCode = context.url.searchParams.get("code");

  if (!authCode) {
    return context.redirect(localizeUrl("/home"));
  }

  const { data, error } = await context.locals.db.auth.exchangeCodeForSession(authCode);

  if (error || !data.session) {
    return context.redirect(localizeUrl("/login"));
  }

  return context.redirect(localizeUrl("/dashboard"));
};

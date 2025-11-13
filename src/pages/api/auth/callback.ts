export const prerender = false;

import type { APIContext, APIRoute } from "astro";

export const GET: APIRoute = async (context: APIContext): Promise<Response> => {
  const authCode = context.url.searchParams.get("code");

  if (!authCode) {
    return context.redirect("/");
  }

  const { data, error } = await context.locals.db.auth.exchangeCodeForSession(authCode);

  if (error || !data.session) {
    return context.redirect("/login");
  }

  return context.redirect("/dashboard");
};

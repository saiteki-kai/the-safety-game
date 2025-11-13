export const prerender = false;

import type { APIContext, APIRoute } from "astro";

export const GET: APIRoute = async (context: APIContext) => {
  await context.locals.db.auth.signOut();

  return context.redirect("/login");
};

import { defineMiddleware } from "astro:middleware";
import { createClient } from "@db/supabase";
import type { APIContext, MiddlewareNext } from "astro";
import micromatch from "micromatch";

const protectedRoutes = ["/dashboard"];
const protectedAPIRoutes = ["/api/submissions"];

export const onRequest = defineMiddleware(async (context: APIContext, next: MiddlewareNext) => {
  const supabase = createClient({
    request: context.request,
    cookies: context.cookies,
  });

  const { data } = await supabase.auth.getClaims();
  console.log("Middleware claims:", !!data?.claims);

  console.log("Middleware request URL:", context.request.url);

  const user_id = data?.claims?.sub || null;
  context.locals.user = user_id || null;

  if (micromatch.isMatch(context.url.pathname, protectedRoutes)) {
    if (!data?.claims) {
      console.log("Middleware redirecting to login");
      return context.redirect("/login");
    }

    if (micromatch.isMatch(context.url.pathname, ["/dashboard"])) {
      // Rerieve user team
      const { data, error } = await supabase.from("team_members").select("team_id").eq("user_id", user_id).maybeSingle();

      if (error) {
        console.error("Error fetching team member:", error);
      }

      context.locals.team = data || null;
    }
  }

  if (micromatch.isMatch(context.url.pathname, protectedAPIRoutes)) {
    if (!data?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  }

  return next();
});

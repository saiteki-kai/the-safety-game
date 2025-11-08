import { defineMiddleware } from "astro:middleware";
import type { APIContext, MiddlewareNext } from "astro";
import micromatch from "micromatch";
import { serverClient } from "@/lib/supabase";

const protectedRoutes = ["/dashboard", "/admin"];
const protectedAPIRoutes = ["/api/submissions"];

export const onRequest = defineMiddleware(async (context: APIContext, next: MiddlewareNext) => {
  const supabase = serverClient(context);

  // Retrieve user claims
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  // If there's an error fetching claims, redirect to login
  if (claimsError) {
    console.error("Error fetching auth claims:", claimsError);
    return context.redirect("/login");
  }

  // Protect routes that require authentication
  if (micromatch.isMatch(context.url.pathname, protectedRoutes)) {
    if (!claimsData?.claims) {
      context.locals.user = null;
      context.locals.team = null;

      console.log("Middleware redirecting to login");
      return context.redirect("/login");
    }

    // Retrieve user team
    const { data: userTeamData, error: teamError } = await supabase
      .from("team_members")
      .select("teams(*), profiles(*)")
      .eq("user_id", claimsData.claims?.sub)
      .maybeSingle();

    if (teamError) {
      console.error("Error fetching team member:", teamError);
      return context.redirect(context.url.pathname);
    }

    context.locals.team = (userTeamData && userTeamData["teams"]) || null;
    context.locals.user = (userTeamData && userTeamData["profiles"]) || null;

    // Admin route protection
    if (context.url.pathname.startsWith("/admin")) {
      const isAdmin = context.locals.user?.role === "admin";

      if (!isAdmin) {
        console.log("Middleware blocking non-admin access to admin route");
        return new Response("Forbidden", { status: 403 });
      }
    }
  }

  // Protect API routes that require authentication
  if (micromatch.isMatch(context.url.pathname, protectedAPIRoutes)) {
    if (!claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  }

  return next();
});

import { defineMiddleware } from "astro:middleware";
import type { APIContext, MiddlewareNext } from "astro";
import micromatch from "micromatch";
import { serverClient } from "@/lib/supabase";

const protectedRoutes = ["/dashboard", "/admin"];
const protectedAPIRoutes = ["/api/submissions", "_actions/**"];

export const onRequest = defineMiddleware(async (context: APIContext, next: MiddlewareNext) => {
  if (context.isPrerendered) {
    return next();
  }

  // Set up Supabase client in locals
  context.locals.db = serverClient(context);

  // Retrieve user claims
  const { data: claimsData, error: claimsError } = await context.locals.db.auth.getClaims();

  // If there's an error fetching claims, redirect to login
  if (claimsError) {
    console.error("Error fetching auth claims:", claimsError);
    return context.redirect("/");
  }

  context.locals.user_id = claimsData?.claims?.sub || null;

  // Protect routes that require authentication
  if (micromatch.isMatch(context.url.pathname, protectedRoutes)) {
    if (!claimsData?.claims) {
      return context.redirect("/login");
    }

    // Admin route protection
    if (context.url.pathname.startsWith("/admin")) {
      const isAdmin = claimsData?.claims?.role === "admin";

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

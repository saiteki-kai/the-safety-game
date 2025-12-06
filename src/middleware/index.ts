import { defineMiddleware } from "astro:middleware";
import type { APIContext, MiddlewareNext } from "astro";
import micromatch from "micromatch";
import { getUserInfo } from "@/db/users";
import { localizeUrl } from "@/lib/i18n";
import { serverClient } from "@/lib/supabase";

// Protected routes - support both root and localized paths
const protectedRoutes = ["/dashboard", "/admin", "**/dashboard", "**/admin"];
const protectedAPIRoutes = ["/api/submissions", "_actions/**"];

export const onRequest = defineMiddleware(async (context: APIContext, next: MiddlewareNext) => {
  console.log(`Middleware processing request for: ${context.url.pathname}`);

  if (context.isPrerendered) {
    console.log("Request is prerendered");
    return next();
  }

  // Set up Supabase client in locals
  context.locals.db = serverClient(context);

  // Retrieve user claims
  const { data: claimsData, error: claimsError } = await context.locals.db.auth.getClaims();

  // If there's an error fetching claims, redirect to login
  if (claimsError) {
    console.error("Error fetching auth claims:", claimsError);
    return context.redirect(localizeUrl("/home"));
  }

  context.locals.user_id = claimsData?.claims?.sub || null;

  if (context.locals.user_id) {
    try {
      context.locals.user = await getUserInfo(context.locals.db, context.locals.user_id);
    } catch (error) {
      console.error("Error fetching profile in middleware:", error);
      context.locals.user = null;
    }
  } else {
    context.locals.user = null;
  }

  // Protect routes that require authentication
  if (micromatch.isMatch(context.url.pathname, protectedRoutes)) {
    if (!claimsData?.claims) {
      return context.redirect(localizeUrl("/login"));
    }

    // Admin route protection - check for /admin or /[locale]/admin
    const isAdminRoute = context.url.pathname.startsWith("/admin") || context.url.pathname.match(/^\/[a-z]{2}\/admin/);
    if (isAdminRoute) {
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

export const prerender = false;

import type { Provider } from "@supabase/supabase-js";
import type { APIContext, APIRoute } from "astro";
import { getRelativeLocaleUrl } from "astro:i18n";

export const POST: APIRoute = async (context: APIContext) => {
  const formData = await context.request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();

  if (provider) {
    const { data, error } = await context.locals.db.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${new URL(context.request.url).origin}/api/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      return new Response(error?.message, { status: 500 });
    }

    const target = data?.url;
    console.log("Redirecting to OAuth provider:", target);

    if (!target) {
      return new Response("Unable to initiate OAuth flow", { status: 500 });
    }

    return context.redirect(target);
  }

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { data, error } = await context.locals.db.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data) {
    return new Response(error?.message, { status: 500 });
  }

  return context.redirect(getRelativeLocaleUrl(context.currentLocale, "/dashboard"));
};

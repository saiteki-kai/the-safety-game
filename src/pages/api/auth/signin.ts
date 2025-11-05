export const prerender = false;

import { supabase } from "@db/supabase";
import type { Provider } from "@supabase/supabase-js";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();

  if (provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${new URL(request.url).origin}/api/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    const target = data?.url;

    if (!target) {
      return new Response("Unable to initiate OAuth flow", { status: 500 });
    }

    return redirect(target);
  }

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
    sameSite: "strict",
    secure: true,
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
    sameSite: "strict",
    secure: true,
  });

  return redirect("/dashboard");
};

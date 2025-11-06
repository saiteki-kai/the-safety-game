export const prerender = false;

import { createClient } from "@db/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createClient({
    request: request,
    cookies: cookies,
  });

  await supabase.auth.signOut();

  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  return redirect("/login");
};

export const prerender = false;

import type { APIRoute } from "astro";
import { serverClient } from "@/lib/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = serverClient({
    request: request,
    cookies: cookies,
  });

  await supabase.auth.signOut();

  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  return redirect("/login");
};

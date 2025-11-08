import { createBrowserClient, createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";
import type { Database } from "./supabase.generated";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

export function serverClient({ request, cookies }: { request: Request; cookies: AstroCookies }) {
  const cookieHeader = request.headers.get("Cookie") || "";

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        const cookies = parseCookieHeader(cookieHeader);
        return cookies.map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
      },
    },
  });
}

export function browserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

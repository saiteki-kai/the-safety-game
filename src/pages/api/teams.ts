export const prerender = false;

import { createClient } from "@db/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { name } = await request.json();

  const supabase = createClient({
    request: request,
    cookies: cookies,
  });
  const { data, error } = await supabase.from("teams").insert({ name }).select().single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ team: data }), { status: 201 });
};

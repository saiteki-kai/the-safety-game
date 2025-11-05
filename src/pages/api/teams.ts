export const prerender = false;

import { supabase } from "@db/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { name } = await request.json();

  const { data, error } = await supabase.from("teams").insert({ name, members: [] }).select().single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ team: data }), { status: 201 });
};

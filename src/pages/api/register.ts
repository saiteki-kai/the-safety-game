export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from "@db/server";

export const GET: APIRoute = async ({ request }) => {
    const { data, error } = await supabase.from("teams").insert([{ id: 55, name: "team from page", members: ["Alice", "Bob"] }]);

    if (error) {
        console.error("Error inserting team:", error);
        return new Response("Error inserting team", { status: 500 });
    }

    return new Response("Team inserted successfully", { status: 200 });
}

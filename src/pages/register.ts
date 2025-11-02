import { supabase } from "@db/server";

export async function GET() {
    const { data, error } = await supabase.from("teams").insert([{ id: 50, name: "team from register page", members: ["Alice", "Bob"] }]);

    if (error) {
        console.error("Error inserting team:", error);
        return new Response("Error inserting team", { status: 500 });
    }

    return new Response("Team inserted successfully", { status: 200 });
}

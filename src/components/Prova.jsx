export const prerender = false;

import { supabase } from "@db/server";

export default function Prova() {
    console.log("Prova component rendered");

    return (
        <div>
            <button onClick={async () => {
                console.log("Button clicked");

                const { data, error } = await supabase
                    .from("teams")
                    .insert([{ name: "wed fff", members: ["SS", "Bob"] }])
                    .select();

                console.log("Insert Result:", { data, error });

                alert("Clicked!");
            }}>Insert</button>
        </div>
    );
}

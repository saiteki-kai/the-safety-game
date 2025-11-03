export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "@db/server";

const jsonResponse = (body: unknown, init?: ResponseInit) =>
    new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        ...init,
    });

const normalizeString = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

type RegisterBody =
    | {
            mode: "individual";
            firstName: string;
            lastName: string;
            email: string;
        }
    | {
            mode: "team";
            teamName: string;
            contactEmail: string;
            members: Array<{ firstName: string; lastName: string }>;
        };

export const POST: APIRoute = async ({ request }) => {
    let body: RegisterBody | null = null;

    try {
        body = (await request.json()) as RegisterBody;
    } catch (error) {
        console.error("Invalid JSON payload", error);
        return jsonResponse({ message: "Payload non valido." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || !("mode" in body)) {
        return jsonResponse({ message: "Richiesta non valida." }, { status: 400 });
    }

    if (body.mode === "individual") {
        const firstName = normalizeString(body.firstName);
        const lastName = normalizeString(body.lastName);
        const email = normalizeString(body.email);

        if (!firstName || !lastName || !email) {
            return jsonResponse(
                { message: "Nome, cognome ed email sono obbligatori per l'iscrizione individuale." },
                { status: 400 },
            );
        }

        const record = {
            name: `${firstName} ${lastName}`.trim(),
            members: [
                {
                    mode: body.mode,
                    firstName,
                    lastName,
                    fullName: `${firstName} ${lastName}`.trim(),
                    email,
                },
            ],
        };

            const { data, error } = await supabase
                .from("teams")
                .insert([record])
            .select("id, name")
            .single();

        if (error) {
            console.error("Errore durante la registrazione individuale:", error);
            return jsonResponse({ message: "Impossibile completare l'iscrizione." }, { status: 500 });
        }

        return jsonResponse({ message: "Iscrizione individuale registrata.", teamId: data?.id, name: data?.name }, { status: 201 });
    }

    if (body.mode === "team") {
        const teamName = normalizeString(body.teamName);
        const contactEmail = normalizeString(body.contactEmail);
        const membersInput = Array.isArray(body.members) ? body.members : [];

        const members = membersInput
            .map((member) => ({ firstName: normalizeString(member.firstName), lastName: normalizeString(member.lastName) }))
            .filter((member) => member.firstName && member.lastName);

        if (!teamName || !contactEmail) {
            return jsonResponse(
                { message: "Il nome del team e l'email di contatto sono obbligatori." },
                { status: 400 },
            );
        }

        if (members.length < 2 || members.length > 4) {
            return jsonResponse(
                { message: "Il team deve avere da 2 a 4 membri." },
                { status: 400 },
            );
        }

        const record = {
            name: teamName,
            members: members.map((member, index) => ({
                mode: body.mode,
                firstName: member.firstName,
                lastName: member.lastName,
                fullName: `${member.firstName} ${member.lastName}`.trim(),
                ...(index === 0 ? { contactEmail } : {}),
            })),
        };

            const { data, error } = await supabase
                .from("teams")
                .insert([record])
            .select("id, name")
            .single();

        if (error) {
            console.error("Errore durante la registrazione del team:", error);
            return jsonResponse({ message: "Impossibile completare l'iscrizione." }, { status: 500 });
        }

        return jsonResponse({ message: "Team registrato con successo.", teamId: data?.id, name: data?.name }, { status: 201 });
    }

    return jsonResponse({ message: "Modalità di registrazione non supportata." }, { status: 400 });
};

export const GET: APIRoute = () =>
    jsonResponse({ message: "Usare una richiesta POST per registrarsi." }, { status: 405, statusText: "Method Not Allowed" });

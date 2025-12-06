import type { APIContext, APIRoute } from "astro";
import { localizeUrl } from "@/lib/i18n";

export const POST: APIRoute = async (context: APIContext) => {
  const formData = await context.request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { error } = await context.locals.db.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return context.redirect(localizeUrl("/login"));
};

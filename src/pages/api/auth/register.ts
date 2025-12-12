import type { APIContext, APIRoute } from "astro";
import { localizeUrl, getLocaleFromPath } from "@/lib/i18n";
import type { Locale } from "@/lib/translations";

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
  const localeFromForm = formData.get("locale")?.toString() as Locale | undefined;
  const locale = (localeFromForm ?? getLocaleFromPath(context.url.pathname)) as Locale;
  return context.redirect(localizeUrl("/login", locale));
};

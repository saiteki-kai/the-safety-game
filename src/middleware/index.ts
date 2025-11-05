import { defineMiddleware, sequence } from "astro:middleware";
import micromatch from "micromatch";
import { supabase } from "@db/supabase";

const redirectRoutes = ["/signin", "/register"];
const protectedRoutes = ["/dashboard"];
const protectedAPIRoutes = ["/api/subissions"];

export const onRequest = defineMiddleware(async (context: any, next: () => any) => {
    if (micromatch.isMatch(context.url.pathname, protectedRoutes)) {
        console.log("Checking authentication for protected route...");

        const accessToken = context.cookies.get("sb-access-token");
        const refreshToken = context.cookies.get("sb-refresh-token");

        if (!accessToken || !refreshToken) {
            return context.redirect("/signin");
        }

        const { data, error } = await supabase.auth.setSession({
            refresh_token: refreshToken.value,
            access_token: accessToken.value,
        });

        if (error) {
            context.cookies.delete("sb-access-token", {
                path: "/",
            });
            context.cookies.delete("sb-refresh-token", {
                path: "/",
            });
            return context.redirect("/signin");
        }

        context.locals.email = data.user?.email!;
        context.cookies.set("sb-access-token", data?.session?.access_token!, {
            sameSite: "strict",
            path: "/",
            secure: true,
        });
        context.cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
            sameSite: "strict",
            path: "/",
            secure: true,
        });
    }


    if (micromatch.isMatch(context.url.pathname, redirectRoutes)) {
        console.log("Checking authentication for redirect...");
        const accessToken = context.cookies.get("sb-access-token");
        const refreshToken = context.cookies.get("sb-refresh-token");

        if (accessToken && refreshToken) {
            return context.redirect("/dashboard");
        }
    }

    if (micromatch.isMatch(context.url.pathname, protectedAPIRoutes)) {
        const accessToken = context.cookies.get("sb-access-token");
        const refreshToken = context.cookies.get("sb-refresh-token");

        // Check for tokens
        if (!accessToken || !refreshToken) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized",
                }),
                { status: 401 },
            );
        }

        // Verify the tokens
        const { error } = await supabase.auth.setSession({
            access_token: accessToken.value,
            refresh_token: refreshToken.value,
        });

        if (error) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized",
                }),
                { status: 401 },
            );
        }
    }

    return next();
});

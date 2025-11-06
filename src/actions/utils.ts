import type { ActionAPIContext } from "astro:actions";
import { createClient } from "@db/supabase";

export const db = ({ request, cookies }: ActionAPIContext) => {
  return createClient({
    request,
    cookies,
  });
};

import type { ActionAPIContext } from "astro:actions";
import { serverClient } from "@/lib/supabase";

export const db = ({ request, cookies }: ActionAPIContext) => {
  return serverClient({
    request,
    cookies,
  });
};

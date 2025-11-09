import type { Profile } from "@/lib/supabase.types";

export type MemberSlot = {
  key: string;
  name: string;
  initials: string;
  isPlaceholder: boolean;
  member?: Profile;
};

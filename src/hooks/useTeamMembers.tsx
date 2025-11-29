import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useEffectEvent, useState } from "react";
import { getTeamMembers } from "@/db/teams";
import type { Profile } from "@/lib/supabase.types";

export function useTeamMembers(supabase: SupabaseClient, teamId: string) {
  const [members, setMembers] = useState<Profile[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = useEffectEvent(async () => {
    setError(null);
    try {
      const data = await getTeamMembers(supabase, teamId);
      setMembers(data ?? []);
    } catch (error) {
      setError(error as Error);
    }
  });

  const unsubscribe = useEffectEvent((teamId: string) => {
    const channel = supabase
      .channel(`team-members-${teamId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_members", filter: `team_id=eq.${teamId}` },
        async () => {
          await fetchMembers();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  });

  useEffect(() => {
    void fetchMembers();
    return unsubscribe(teamId);
  }, []);

  return { members, error };
}

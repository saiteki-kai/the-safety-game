import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useEffectEvent, useState } from "react";
import { getTeamSubmissions } from "@/db/submissions";
import type { TeamSubmissions } from "@/lib/supabase.types";

export function useTeamSubmissions(supabase: SupabaseClient, teamId: string) {
  const [submissions, setSubmissions] = useState<TeamSubmissions[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubmissions = useEffectEvent(async () => {
    setError(null);
    try {
      const data = await getTeamSubmissions(supabase, teamId);
      setSubmissions(data ?? []);
    } catch (error) {
      setError(error);
    }
  });

  const unsubscribe = useEffectEvent((teamId: string) => {
    const channel = supabase
      .channel(`submission-channel-${teamId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions", filter: `team_id=eq.${teamId}` },
        async () => {
          console.log("Re-fetching team submissions due to change...");
          await fetchSubmissions();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  });

  useEffect(() => {
    void fetchSubmissions();
    return unsubscribe(teamId);
  }, [teamId]);

  return { submissions, error };
}

import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useEffectEvent, useState } from "react";

interface LeaderboardEntry {
  id: string;
  name: string;
  final_score: number | null;
  last_submission: string | null;
}

export function useLeaderboardPosition(supabase: SupabaseClient, teamId: string) {
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosition = useEffectEvent(async () => {
    setError(null);
    try {
      // Fetch the full leaderboard (ordered by final_score desc in the view)
      const { data, error: queryError } = await supabase
        .from("leaderboard")
        .select("id, name, final_score, last_submission")
        .order("final_score", { ascending: false, nullsFirst: false });

      if (queryError) {
        throw new Error(queryError.message);
      }

      if (data && Array.isArray(data)) {
        // Find the team's position (1-indexed)
        const index = (data as LeaderboardEntry[]).findIndex((entry) => entry.id === teamId);
        setPosition(index >= 0 ? index + 1 : null);
      } else {
        setPosition(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setPosition(null);
    }
  });

  const unsubscribe = useEffectEvent(() => {
    // Listen for changes in the submissions table to refresh leaderboard position
    const channel = supabase
      .channel(`leaderboard-channel-${teamId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions", filter: `team_id=eq.${teamId}` },
        async () => {
          await fetchPosition();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  });

  useEffect(() => {
    void fetchPosition();
    return unsubscribe();
  }, []);

  return { position, error };
}

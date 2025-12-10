import Icon from "@components/common/Icon";
import IconLabel from "@components/common/IconLabel";
import { Info as InfoIcon } from "lucide-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo, useEffect, useEffectEvent, useState } from "react";
import { getLeaderboard } from "@/db/submissions";
import type { IconName } from "@/lib/icons";
import { browserClient } from "@/lib/supabase";
import type { Leaderboard } from "@/lib/supabase.types";

// TEMPORARY: Force Italian locale
const FORCED_LOCALE = "it";

// TEMPORARY: Hardcoded Italian translations
const IT_LEADERBOARD = {
  rank: "Posizione",
  teamName: "Team",
  score: "Punteggio",
  lastSubmission: "Ultima Consegna",
  loadError: "Impossibile caricare la classifica. Riprova più tardi.",
};

const IT_COMMON = {
  error: "Si è verificato un errore",
};

const formatPercent = (v: number) => {
  if (typeof v !== "number" || !Number.isFinite(v)) return "0.00";
  return (v * 100).toFixed(2);
};

const formatDateShortNoYear = (value: string) => {
  try {
    return new Intl.DateTimeFormat(FORCED_LOCALE, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (_e) {
    return value;
  }
};

// highlight configuration for top ranks
const highlightConfig: Record<number, { row: string; icon?: { name: string; class: string } }> = {
  1: { row: "highlight-1", icon: { name: "trophy", class: "text-yellow-500" } },
  2: { row: "highlight-2", icon: { name: "medal", class: "text-gray-400" } },
  3: { row: "highlight-3", icon: { name: "award", class: "text-amber-600" } },
};

export default function LeaderboardTable({ emptyMessage }: { emptyMessage: string }) {
  // TEMPORARY: Using hardcoded Italian
  
  const supabaseClient = useMemo(() => browserClient(), []);
  
  const [leaderboard, setLeaderboard] = useState<Leaderboard[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useEffectEvent(async () => {
    // setLoading(true);
    // setError(null);
    // try {
    //   const data = await getLeaderboard(supabaseClient);
    //   setLeaderboard(data);
    // } catch (err: unknown) {
    //   setError(err instanceof PostgrestError ? err : new Error(IT_COMMON.error));
    //   setLeaderboard([]);
    // } finally {
    //   setLoading(false);
    // }
  });

  useEffect(() => {
    fetchData();

    const channel = supabaseClient
      .channel("submission_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
        },
        async (_payload) => fetchData(),
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, fetchData]);

  const isEmpty = !loading && (!leaderboard || leaderboard.length === 0) && !error;

  return (
    <>
      {loading ? (
        // Table-shaped skeleton to reduce layout shift
        <table className="table-base animate-pulse">
          <colgroup>
            <col style={{ width: "5rem" }} />
            <col style={{ width: "6rem" }} />
            <col />
            <col style={{ width: "10rem" }} />
          </colgroup>
          <thead>
            <tr>
              <th className="text-center">{IT_LEADERBOARD.rank}</th>
              <th className="text-center">{IT_LEADERBOARD.score}</th>
              <th className="text-left">{IT_LEADERBOARD.teamName}</th>
              <th className="text-right">{IT_LEADERBOARD.lastSubmission}</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
              <tr key={`loading-${k}`} className="h-12">
                <td className="td py-1">
                  <div className="h-2 w-12 rounded bg-neutral-200" />
                </td>
                <td className="td py-1">
                  <div className="mx-auto h-2 w-16 rounded bg-neutral-200" />
                </td>
                <td className="td py-1">
                  <div className="mx-auto h-2 w-6 rounded bg-neutral-200" />
                </td>
                <td className="td py-1">
                  <div className="h-2 w-48 rounded bg-neutral-200" />
                </td>
                <td className="td py-1 text-right">
                  <div className="ml-auto h-2 w-24 rounded bg-neutral-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : error ? (
        <div className="flex h-full items-center justify-center py-6">
          <div className="leaderboard-empty flex-col justify-center text-center">
            <Icon name="triangle-alert" size={28} className="mx-auto text-red-500" />
            <p className="mt-3 text-red-600 text-sm">{IT_LEADERBOARD.loadError}</p>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex h-full items-center justify-center py-6">
          <IconLabel
            name="info"
            size={28}
            iconClass="text-neutral-400"
            as="div"
            className="leaderboard-empty flex-col justify-center"
          >
            {emptyMessage}
          </IconLabel>
        </div>
      ) : (
        <table className="table-base">
          <colgroup>
            <col style={{ width: "5rem" }} />
            <col style={{ width: "6rem" }} />
            <col />
            <col style={{ width: "10rem" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="text-center">
                {IT_LEADERBOARD.rank}
              </th>
              <th scope="col" className="text-center">
                {IT_LEADERBOARD.score}
              </th>
              <th scope="col" className="text-left">
                {IT_LEADERBOARD.teamName}
              </th>
              <th scope="col" className="text-right">
                {IT_LEADERBOARD.lastSubmission}
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard?.map((team, index) => {
              const rank = index + 1;
              const highlight = highlightConfig[rank];
              const rowClass = `leaderboard-row ${highlight?.row ?? ""} ${team.name === "ChatGPT" ? "chatgpt-row" : ""}`;

              return (
                <tr className={rowClass} key={team.name}>
                  <td className="td rank-cell py-1 text-center">
                    {highlight?.icon ? (
                      <div className="podium-icon">
                        <Icon name={highlight.icon.name as IconName} size={20} className={highlight.icon.class} />
                      </div>
                    ) : (
                      <div className="podium-icon">{rank}</div>
                    )}
                  </td>
                  <td className="td score-mono py-1 text-center">{formatPercent(team.final_score)}</td>
                  <td className="td team-name py-1 text-left">
                    {team.name === "ChatGPT" ? (
                      <IconLabel
                        name="chatgpt"
                        size={16}
                        iconClass="m-auto ml-1"
                        as="span"
                        position="end"
                        className="inline-flex items-center font-semibold text-emerald-500"
                      >
                        {team.name}
                      </IconLabel>
                    ) : (
                      team.name
                    )}
                  </td>
                  <td className="td py-1 text-right">
                    <time dateTime={team.last_submission}>{formatDateShortNoYear(team.last_submission)}</time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

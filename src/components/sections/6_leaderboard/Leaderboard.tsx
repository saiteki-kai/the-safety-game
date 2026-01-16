import Icon from "@components/common/Icon";
import IconLabel from "@components/common/IconLabel";
import { Info as InfoIcon } from "lucide-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo, useEffect, useCallback, useState } from "react";
import { getLeaderboard } from "@/db/submissions";
import type { IconName } from "@/lib/icons";
import { browserClient } from "@/lib/supabase";
import type { Leaderboard } from "@/lib/supabase.types";
import { getTranslations, leaderboardTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";

const formatPercent = (v: number) => {
  if (typeof v !== "number" || !Number.isFinite(v)) return "0.00";
  return (v * 100).toFixed(2);
};

// highlight configuration for top ranks
const highlightConfig: Record<number, { row: string; icon?: { name: string; class: string } }> = {
  1: { row: "highlight-1", icon: { name: "trophy", class: "text-yellow-500" } },
  2: { row: "highlight-2", icon: { name: "medal", class: "text-gray-400" } },
  3: { row: "highlight-3", icon: { name: "award", class: "text-amber-600" } },
};

// Temporary hardcoded leaderboard data
const USE_MOCK_LEADERBOARD = true;
const MOCK_LEADERBOARD: Leaderboard[] = [
  {
    id: "mock-1",
    final_score: 0.816974,
    name: "ChatGPT",
    last_submission: "2025-11-01T08:00:05+00:00",
  },
  {
    id: "mock-2",
    final_score: 0.744455,
    name: "MiSnerva",
    last_submission: "2026-01-12T15:19:05+00:00",
  },
  {
    id: "mock-3",
    final_score: 0.64712,
    name: "Vibe Prompters",
    last_submission: "2026-01-12T20:47:11+00:00",
  },
];

export default function LeaderboardTable({ emptyMessage, locale = DEFAULT_LOCALE }: { emptyMessage: string; locale?: Locale }) {
  const t = getTranslations(leaderboardTranslations, locale);
  const supabaseClient = useMemo(() => browserClient(), []);

  const [data, setData] = useState<Leaderboard[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDatePretty = useCallback((value: string) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    } catch {
      return value;
    }
  }, [locale]);

  const fetchLeaderboardData = useCallback(async () => {
    if (USE_MOCK_LEADERBOARD) {
      setError(null);
      setData(MOCK_LEADERBOARD);
      setIsLoading(false);
      return;
    }

    // Only show loading on initial load (when data is null)
    if (data === null) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await getLeaderboard(supabaseClient);
      setData(result);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof PostgrestError ? err.message : t.loadError;
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [supabaseClient, t.loadError, data]);

  useEffect(() => {
    if (USE_MOCK_LEADERBOARD) {
      setError(null);
      setData(MOCK_LEADERBOARD);
      setIsLoading(false);
      return;
    }

    fetchLeaderboardData();

    const channel = supabaseClient
      .channel("leaderboard_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
        },
        () => {
          fetchLeaderboardData();
        },
      )
      .subscribe();

    return () => {
      void supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, fetchLeaderboardData]);

  // Loading skeleton
  if (isLoading) {
    return (
      <table className="table-base animate-pulse">
        <colgroup>
          <col style={{ width: "5rem" }} />
          <col style={{ width: "6rem" }} />
          <col />
          <col style={{ width: "10rem" }} />
        </colgroup>
        <thead>
          <tr>
            <th className="text-center">{t.rank}</th>
            <th className="text-center">{t.score}</th>
            <th className="text-left">{t.teamName}</th>
            <th className="text-right">{t.lastSubmission}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((k) => (
            <tr key={`skeleton-${k}`} className="h-12">
              <td className="td py-1">
                <div className="h-2 w-12 rounded bg-neutral-200" />
              </td>
              <td className="td py-1">
                <div className="mx-auto h-2 w-16 rounded bg-neutral-200" />
              </td>
              <td className="td py-1">
                <div className="h-2 w-32 rounded bg-neutral-200" />
              </td>
              <td className="td py-1 text-right">
                <div className="ml-auto h-2 w-24 rounded bg-neutral-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Icon name="triangle-alert" size={32} className="text-red-500" />
          <p className="mt-4 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <InfoIcon size={32} className="text-neutral-400" />
          <p className="mt-4 text-sm text-neutral-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Leaderboard table
  return (
    <table className="table-base">
      <colgroup>
        <col style={{ width: "5rem" }} />
        <col style={{ width: "6rem" }} />
        <col />
        <col style={{ width: "14rem" }} />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" className="text-center">
            {t.rank}
          </th>
          <th scope="col" className="text-center">
            {t.score}
          </th>
          <th scope="col" className="text-left">
            {t.teamName}
          </th>
          <th scope="col" className="text-left">
            {t.lastSubmission}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((team, index) => {
          const rank = index + 1;
          const highlight = highlightConfig[rank];
          const rowClass = `leaderboard-row ${highlight?.row ?? ""} ${team.name === "ChatGPT" ? "chatgpt-row" : ""}`;

          return (
            <tr className={rowClass} key={`${team.name}-${rank}`}>
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
              <td className="td py-1 text-left">
                <time dateTime={team.last_submission}>{formatDatePretty(team.last_submission)}</time>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export const prerender = false;

import "@styles/dashboard.css";

import { Button } from "@components/ui/button";
import { supabase } from "@db/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import TeamDashboardView from "./TeamDashboardView";
import TeamSetupPanel from "./TeamSetupPanel";

type TeamShape = {
  id?: string;
  name?: string | null;
};

type UserShape = {
  name: string;
  email: string;
};

type DashboardClientProps = {
  team?: TeamShape | null;
  user?: UserShape | null;
};

const FALLBACK_USER: UserShape = {
  name: "Alex Johnson",
  email: "student@university.edu",
};

const parseTeamFromMetadata = (metadata: Record<string, unknown> | undefined): TeamShape | null => {
  if (!metadata) return null;

  const maybeTeam = metadata.team;
  if (maybeTeam && typeof maybeTeam === "object") {
    const teamRecord = maybeTeam as Record<string, unknown>;
    const id = typeof teamRecord.id === "string" ? teamRecord.id : undefined;
    const name = typeof teamRecord.name === "string" ? teamRecord.name : undefined;

    if (id || name) {
      return {
        id,
        name: name ?? null,
      };
    }
  }

  const fallbackName = [metadata.team_name, metadata.teamName, metadata.team].find(
    (value) => typeof value === "string",
  ) as string | undefined;
  const fallbackId = [metadata.team_id, metadata.teamId].find((value) => typeof value === "string") as
    | string
    | undefined;

  if (!fallbackName && !fallbackId) return null;

  return {
    id: fallbackId,
    name: fallbackName ?? null,
  };
};

export default function DashboardClient({ team, user }: DashboardClientProps) {
  const activeUser = user ?? FALLBACK_USER;
  const [remoteTeam, setRemoteTeam] = useState<TeamShape | null | undefined>(undefined);
  const resolvedTeam = remoteTeam === undefined ? (team ?? null) : remoteTeam;
  const hasTeam = Boolean(resolvedTeam);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const isActiveRef = useRef<boolean>(true);

  const applyTeam = useEffectEvent((nextTeam: TeamShape | null) => {
    if (!isActiveRef.current) return;
    setRemoteTeam(nextTeam);
  });

  const refreshTeamFromMetadata = useEffectEvent(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Unable to fetch user info", error);
        applyTeam(null);
        return null;
      }

      const userInfo = data.user;
      if (!userInfo) {
        applyTeam(null);
        return null;
      }

      const nextTeam = parseTeamFromMetadata(userInfo.user_metadata as Record<string, unknown> | undefined);
      applyTeam(nextTeam);
      return userInfo.id ?? null;
    } catch (metadataError) {
      console.error("Unexpected error while syncing team", metadataError);
      applyTeam(null);
      return null;
    }
  });

  const setupRealtimeSubscription = useEffectEvent((userId: string | null) => {
    if (userId === currentUserIdRef.current) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    currentUserIdRef.current = userId;

    if (!userId) return;

    try {
      channelRef.current = supabase
        .channel(`user-team-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${userId}`,
          },
          () => {
            void refreshTeamFromMetadata();
          },
        )
        .subscribe();
    } catch (subscriptionError) {
      console.error("Unable to subscribe to team updates", subscriptionError);
    }
  });

  const handleAuthStateChange = useEffectEvent(
    (sessionUserId: string | null, metadata: Record<string, unknown> | undefined) => {
      applyTeam(parseTeamFromMetadata(metadata));
      setupRealtimeSubscription(sessionUserId);
    },
  );

  useEffect(() => {
    isActiveRef.current = true;

    const syncTeam = async () => {
      const userId = await refreshTeamFromMetadata();
      setupRealtimeSubscription(userId);
    };

    void syncTeam();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(_event)

      const metadata = session?.user?.user_metadata as Record<string, unknown> | undefined;
      const sessionUserId = session?.user?.id ?? null;
      handleAuthStateChange(sessionUserId, metadata);
    });

    return () => {
      isActiveRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      currentUserIdRef.current = null;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <section className="dashboard-section">
      <div className="dashboard-shell">
        <div className="dashboard-container">
          {/* Top bar: welcome (left) and sign out (right) */}
          <div className="dashboard-topbar">
            <p className="dashboard-greeting">Bentornato, {activeUser.name}</p>
            <Button
              onClick={() => {
                fetch("/api/auth/signout", { method: "GET" }).catch((error) => {
                  console.error("Unable to sign out", error);
                });
              }}
              className="dashboard-signout"
            >
              Esci
            </Button>
          </div>

          {hasTeam ? <TeamDashboardView teamName={resolvedTeam?.name} /> : <TeamSetupPanel />}
        </div>
      </div>
    </section>
  );
}

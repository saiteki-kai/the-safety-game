import "@styles/dashboard.css";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Copy, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTeam } from "./TeamProvider";
import type { UserShape } from "./types";

type TeamDashboardViewProps = {
  user?: UserShape | null;
};

export default function TeamDashboardView({ user }: TeamDashboardViewProps) {
  const { team } = useTeam();
  const [isJoinCodeCopied, setJoinCodeCopied] = useState(false);

  const fallbackName = user?.name && user.name.trim().length > 0 ? user.name : "Il tuo team";
  const resolvedTeamName = team?.name && team.name.trim().length > 0 ? team.name : fallbackName;
  const teamJoinCode = team?.join_code ?? "S5F4D7";
  const userEmail = user?.email ?? "user@example.com";
  const membersList = Array.isArray(team?.members) && team.members.length > 0 ? team.members : [
    "Member 1",
    "Member 2",
    "Member 3",
    "Member 4",
  ];

  const lastAccessLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    [],
  );

  useEffect(() => {
    if (!isJoinCodeCopied) {
      return;
    }

    const timer = window.setTimeout(() => setJoinCodeCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [isJoinCodeCopied]);

  return (
    <div className="dashboard-team-wrapper space-y-6">
      <section className="rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-xl font-semibold text-neutral-500">
              {(user?.name ?? "User").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">{user?.name ?? "User"}</p>
              <p className="text-sm text-neutral-500">{userEmail}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Team</p>
              <p className="font-medium text-neutral-900">{resolvedTeamName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Ruolo</p>
              <p className="font-medium text-neutral-900">Team member</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Ultimo accesso</p>
              <p className="font-medium text-neutral-900">{lastAccessLabel}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="self-start"
            onClick={() => {
              fetch("/api/auth/signout", { method: "GET" }).catch((error) => {
                console.error("Unable to sign out", error);
              });
            }}
          >
            Esci
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="h-full">
          <CardHeader className="pb-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <CardTitle className="text-xl text-neutral-900">{resolvedTeamName}</CardTitle>
                <CardDescription className="text-sm text-neutral-500">
                  Coordina i membri e condividi il codice per aggiungere nuovi partecipanti.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-wide text-neutral-400">Codice invito</p>
                <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50">
                  <span className="px-5 py-2 text-sm font-mono tracking-widest text-neutral-800">{teamJoinCode}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-full rounded-none border-l border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.clipboard) {
                        navigator.clipboard
                          .writeText(teamJoinCode)
                          .then(() => setJoinCodeCopied(true))
                          .catch(() => setJoinCodeCopied(false));
                        return;
                      }

                      setJoinCodeCopied(false);
                    }}
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span className="ml-2">{isJoinCodeCopied ? "Copiato" : "Copia"}</span>
                  </Button>
                </div>
                <span aria-live="polite" className="text-xs text-neutral-500">
                  {isJoinCodeCopied ? "Codice copiato negli appunti." : ""}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Membri</p>
              <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                {membersList.map((member) => (
                  <li key={member} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" aria-hidden="true" />
                    <span>{member}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="space-y-1 pb-0">
            <CardTitle className="text-xl text-neutral-900">Progressi del team</CardTitle>
            <CardDescription className="text-sm text-neutral-500">
              Aggiorna gli stati per monitorare l&apos;avanzamento verso la challenge.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <dl className="grid gap-4 text-sm text-neutral-700">
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <dt className="text-neutral-500">Prompt testati</dt>
                <dd className="text-lg font-semibold text-neutral-900">35</dd>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <dt className="text-neutral-500">Prompt inviati</dt>
                <dd className="text-lg font-semibold text-neutral-900">50</dd>
              </div>
            </dl>
            <p className="text-xs text-neutral-500">
              Invia almeno 50 prompt per sbloccare la fase successiva.
            </p>
            <Button type="button" className="w-full md:w-auto">
              Registra progresso
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-2 pb-0">
          <CardTitle className="text-xl text-neutral-900">Le mie submission</CardTitle>
          <CardDescription className="text-sm text-neutral-500">
            Qui troverai gli invii effettuati e il loro stato di revisione non appena saranno disponibili.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-center">
            <p className="text-sm font-medium text-neutral-600">Nessuna submission registrata</p>
            <p className="mt-1 text-xs text-neutral-500">Invia il primo prompt per vedere qui lo storico.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
